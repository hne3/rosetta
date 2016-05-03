// Uses Rosetta to visualize a snapshot of runtime state at one particular step

import React from 'react';

import {RNumber, RString, RSymbol, RPointer} from 'rprimitive';
import {RMemBlock} from 'rmemblock';
import {RCollection} from 'rcollection';

// wow command-line bullshittery:
// https://github.com/sporritt/jsPlumb/issues/399
// reference as jsPlumb after npm installing script-loader and imports-loader
import plumb from 'imports?this=>window!script!../node_modules/jsplumb/dist/js/jsPlumb-2.0.3-min.js';

import 'd3';
import _ from 'underscore';


// use the CSS-in-JS approach:
// http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html
var myStyle = {
  stackTd: {
    verticalAlign: 'top',
  },
  heapTd: {
    verticalAlign: 'top',
    paddingLeft: 30,
  },
  stackFrame: {
    paddingTop: 20,
  },
  heapRow: {
    paddingTop: 20,
  },
}

var brightRed = '#e93f34';
var connectorBaseColor = '#005583';
var connectorHighlightColor = brightRed;
var connectorInactiveColor = '#cccccc';
var current_stoplight = null;


// TODO: maybe use custom events (e.g., a simple version of Flux?) to
// pass notifications of pointer start/end nodes UP from children to parents?

// TODO: use React component lifecycle methods to re-render jsPlumb after each
// state change: https://facebook.github.io/react/docs/component-specs.html

export class StepVisualizer extends React.Component {
  // create a unique ID so that jsPlumb doesn't get confused due to
  // multiple StepVisualizer instances being displayed on the same page
  generateID(originalID) {
    console.assert(this.props.visualizerID);
    // (it's safer to start names with a letter rather than a number)
    return 'v' + this.props.visualizerID + '__' + originalID;
  }

  constructor(props) {
    super(props);

    // Key: start CSS ID of jsPlumb-rendered pointer
    // Value: end CSS ID of jsPlumb-rendered pointer
    var connectionEndpointIDs = d3.map();
    this.state = {connectionEndpointIDs};
  }

  render() {
    return (
      <table id={this.generateID('root')}>
        <tbody>
          <tr>
            <td style={myStyle.stackTd}>
              <Stack data={this.props.data}/>
            </td>
            <td style={myStyle.heapTd}>
              <Heap data={this.props.data.heap}/>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  // "Invoked once, only on the client (not on the server), immediately
  // after the initial rendering occurs. At this point in the lifecycle,
  // you can access any refs to your children (e.g., to access the
  // underlying DOM representation). The componentDidMount() method of
  // child components is invoked before that of parent components."
  componentDidMount() {
    console.log("componentDidMount");

    // we can't initialize this until after the entire DOM has been
    // rendered for the first time, since we need the
    // document.getElementById call to find the root element
    //
    // use multiple jsPlumb instances to manage complexity
    // https://jsplumbtoolkit.com/community/doc/home.html#multiple
    //
    // TODO: should we make this part of this.state or keep it independent?
    // maybe keep it independent since it's not related to React?
    this.jsPlumbInstance = jsPlumb.getInstance({
      Endpoint: ["Dot", {radius:3}],
      EndpointStyles: [{fillStyle: connectorBaseColor}, {fillstyle: null} /* make right endpoint invisible */],
      Anchors: ["RightMiddle", "LeftMiddle"],
      PaintStyle: {lineWidth:1, strokeStyle: connectorBaseColor},

      // state machine curve style:
      Connector: [ "StateMachine" ],
      Overlays: [[ "Arrow", { length: 10, width:7, foldback:0.55, location:1 }]],
      EndpointHoverStyles: [{fillStyle: connectorHighlightColor}, {fillstyle: null} /* make right endpoint invisible */],
      HoverPaintStyle: {lineWidth: 1, strokeStyle: connectorHighlightColor},

      // very important to set a custom Container here after the DOM has
      // been rendered, so that this node already exists ...
      Container: document.getElementById(this.generateID('root')),
    });
  }

  // "Invoked immediately after the component's updates are flushed to
  // the DOM. This method is not called for the initial render. Use this as
  // an opportunity to operate on the DOM when the component has been
  // updated."
  componentDidUpdate() {
    console.log("componentDidUpdate");
  }
}


function isPrimitiveType(obj) {
  // TODO: specialize for different languages; see this line in
  // pytutor.js ...
  // var hook_result = this.try_hook("isPrimitiveType", {obj:obj});

  // null is a primitive
  if (obj === null) {
    return true;
  }

  if (typeof obj == "object") {
    // kludge: only 'SPECIAL_FLOAT' objects count as primitives
    // TODO: eliminate this kludge with language-specific rules
    return (obj[0] == 'SPECIAL_FLOAT' || obj[0] == 'JS_SPECIAL_VAL');
  }
  else {
    // non-objects are primitives
    return true;
  }
}

function getRefID(obj) {
  console.assert(obj[0] === 'REF');
  return obj[1];
}


// TODO: specialize for the vocabulary and types in each programming language
// returns an instance of RPrimitive
function createRosettaPrimitive(obj) {
  var typ = typeof obj;
  var ret;

  if (obj == null) { // use == instead of === to be more lenient here
    // null object
    // TODO: different spellings for different languages ...
    // e.g., 'null' for JS, but 'None' for Python
    ret = <RSymbol data={"None"} />;
  }
  else if (typ === "number") {
    // number object
    ret = <RNumber typeTag="number" data={obj}
            renderNumberFunc={(x) => d3.round(x, 4)} />
  }
  else if (typ === "boolean") {
    // TODO: different spellings for different languages ...
    // e.g., 'true' for JS, but 'True' for Python
    ret = <RSymbol typeTag="bool" data={obj ? "True" : "False"} />;
  }
  else if (typ === "string") {
    ret = <RString typeTag="str" data={obj} />;
  }
  else if (typ === "object") {
    // TODO: remove kludge and special treatment for different languages
    // ... abstract into a language-specific layer
    console.assert(obj[0] === 'SPECIAL_FLOAT' || obj[0] === 'JS_SPECIAL_VAL');
    console.assert(obj.length === 2);
    // special number object (???)
    ret = <RSymbol typeTag="number" data={obj[1]} />;
  }
  else {
    console.assert(false);
  }

  console.assert(ret);
  return ret;
}

// emulates Java's hashCode method
// from http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// capture an object's identity by stringifying it and then taking its hashCode
function jsonHash(obj) {
  return JSON.stringify(obj).hashCode();
}

// returns an instance of RPrimitive or RCollection
function createRosettaCompoundObject(obj, memAddr) {
  var ret = undefined;
  
  console.assert(typeof obj == "object");
  if (obj[0] === 'REF') {
    console.assert(obj.length === 2);
    ret = <RPointer
            typeTag="ref"
            data={{start: '??? ' + memAddr,
                   end:   'heap_obj_' + getRefID(obj)}} />;
  }else if (obj[0] == 'semaphore')
    {
	console.assert(obj.length === 3);
	var semName = obj[1];
	ret = <RSymbol typeTag="semaphore" data={semName} />;
	if(obj[2] === 0)
	    {
		show_image("red_light.png", 300, 700, semName.top, semName.bottom, semName.left, semName.right);
	    }
	else if(obj[2] === 1)
	{
	    show_image("green_light.png", 300, 700, semName.top, semName.bottom, semName.left, semName.right);
	}
	else{
	    show_image("yellow_light.png", 300, 700, semName.top, semName.bottom, semName.left, semName.right);
	}

	return ret;
    }
    else if (obj[0] === 'LIST' || obj[0] === 'TUPLE') {
    // list     - ['LIST', elt1, elt2, elt3, ..., eltN]
    // tuple    - ['TUPLE', elt1, elt2, elt3, ..., eltN]
    // use the index as the faux memory address
    ret = <RCollection layout="HorizontalLayout"
            name={obj[0] === 'LIST' ? "list" : "tuple"}
            elts={_.rest(obj).map((c, i) =>
              createRMemBlock(c, memAddr + '_e' + i, i))} />;
  } else if (obj[0] === 'SET') {
    // set      - ['SET', elt1, elt2, elt3, ..., eltN]

    // heuristically compute ncols based on size of set
    // create an R x C matrix:
    var numElts = obj.length - 1;
    // gives roughly a 3x5 rectangular ratio, square is too, err,
    // 'square' and boring
    var numRows = Math.round(Math.sqrt(numElts));
    if (numRows > 3) {
      numRows -= 1;
    }
    var numCols = Math.round(numElts / numRows);
    // round up if not a perfect multiple:
    if (numElts % numRows) {
      numCols += 1;
    }

    // use jsonHash() as the memory address to capture the identity of
    // the element for React (since numerical indices are meaningless for sets)
    ret = <RCollection layout="GridLayout"
            name="set"
            ncols={numCols}
            elts={_.rest(obj).map((c, i) =>
              createRMemBlock(c, memAddr + '_e' + jsonHash(c)))} />;
  } else if (obj[0] === 'DICT') {
    // dict     - ['DICT', [key1, value1], [key2, value2], ..., [keyN, valueN]]

    // use jsonHash() as the memory address to capture the identity of
    // the element for React (since numerical indices are meaningless for dicts)
    ret = <RCollection layout="VerticalLayout"
            name={"dict"}
            elts={_.rest(obj).map((c, i) =>
              createKeyValueRMemBlock(
                c[0], c[1],
                memAddr + '_e' + jsonHash(c[0]), memAddr + '_e' + jsonHash(c[1]))
            )} />;
  } else if (obj[0] === 'INSTANCE_PPRINT') {
    // instance with __str__ defined - ['INSTANCE_PPRINT', class name, <__str__ value>]
    console.assert(obj.length === 3);
    ret = <RSymbol typeTag={obj[1] + " instance"} data={obj[2]} />;
  } else if (obj[0] === 'INSTANCE') {
    // instance - ['INSTANCE', class name, [attr1, value1], [attr2, value2], ..., [attrN, valueN]]
    ret = <RCollection layout="VerticalLayout"
            name={obj[1] + " instance"}
            elts={_.rest(obj, 2).map((c, i) =>
              createKeyValueRMemBlock(
                c[0], c[1],
                memAddr + '_e' + jsonHash(c[0]), memAddr + '_e' + jsonHash(c[1]),
                true /* isSymbolKey */)
            )} />;
  } else if (obj[0] === 'CLASS') {
    // class    - ['CLASS', class name, [list of superclass names], [attr1, value1], [attr2, value2], ..., [attrN, valueN]]
    var label = obj[1] + " class";
    var superclassNames = obj[2];
    if (superclassNames.length > 0) {
      label += (' [extends ' + superclassNames.join(', ') + ']');
    }
    ret = <RCollection layout="VerticalLayout"
            name={label}
            elts={_.rest(obj, 3).map((c, i) =>
              createKeyValueRMemBlock(
                c[0], c[1],
                memAddr + '_e' + jsonHash(c[0]), memAddr + '_e' + jsonHash(c[1]),
                true /* isSymbolKey */)
            )} />;
  } else if (obj[0] === 'FUNCTION') {
    // function - ['FUNCTION', function name, parent frame ID (for nested functions)]
    console.assert(obj.length === 3);
    var funcName = obj[1];
    if (obj[2]) {
      funcName += (' [parent=' + obj[2] + ']');
    }
    ret = <RSymbol typeTag="function" data={funcName} />;
  } else if (obj[0] === 'module') {
    // module   - ['module', module name]
    console.assert(obj.length === 2);
    ret = <RSymbol typeTag="module" data={obj[1]} />;
  } else {
    // catch-all case; put at the very end
    // other    - [<type name>, string representation of object]
    console.assert(obj.length === 2);
    ret = <RSymbol typeTag={obj[0]} data={obj[1]} />;
  }

  console.assert(ret);
  return ret;
}

// TODO: specialize for each language ...
// returns a RMemBlock that wraps obj, located at memAddr
function createRMemBlock(obj, memAddr, index=null, isVertical=true) {
  console.assert(memAddr); // every block should have a valid address!

  var ret = isPrimitiveType(obj) ?
    createRosettaPrimitive(obj) :
    createRosettaCompoundObject(obj, memAddr);

  // NB: key and valueMemAddr seem redundant but they're both necessary
  // since 'key' isn't part of this.props; it's for React internals
  return (
    <RMemBlock v={ret}
      key={memAddr} valueMemAddr={memAddr}
      index={index}
      isVertical={isVertical} />
  );
}

// returns a RMemBlock with a key-value pair;
// use isSymbolKey to make key into a simple RSymbol
function createKeyValueRMemBlock(key, value,
                                 keyMemAddr, valueMemAddr,
                                 isSymbolKey=false,
                                 isVertical=false) {
  console.assert(keyMemAddr);
  console.assert(valueMemAddr);

  var keyObj;
  if (isSymbolKey) {
    keyObj = <RSymbol data={key} />;
  } else {
    keyObj = isPrimitiveType(key) ?
      createRosettaPrimitive(key) :
      createRosettaCompoundObject(key, keyMemAddr);
  }

  var valueObj = isPrimitiveType(value) ?
    createRosettaPrimitive(value) :
    createRosettaCompoundObject(value, valueMemAddr);

  // NB: key and keyMemAddr seem redundant but they're both necessary
  // since 'key' isn't part of this.props; it's for React internals
  return (
    <RMemBlock k={keyObj} v={valueObj}
      key={keyMemAddr}
      keyMemAddr={keyMemAddr}
      valueMemAddr={valueMemAddr}
      isVertical={isVertical} />
  );
}

class AbstractFrame extends React.Component {
  // orderedVarnames is a list of variable names in order
  // varsToVals is a mapping of variable names to their encoded values
  createFrameElements(orderedVarnames, varsToVals) {
    // iterate in order!
    var elts = orderedVarnames.map((c, i) => {
      console.assert(_.has(varsToVals, c));
      return (
        <RMemBlock isVertical={false}
          key={c}
          k={<RSymbol data={c}/>}
          v={createRMemBlock(varsToVals[c], this.getFrameID() + '_' + c)} />
      );
    });
    return elts;
  }
}

class GlobalFrame extends AbstractFrame {
  getFrameID() {
    return 'global_frame';
  }

  render() {
    var frameElts = this.createFrameElements(this.props.ordered_globals,
                                             this.props.globals);
    return (
      // should be wrapped in a RMemBlock so that environment/frame
      // pointers can point to it
      <RMemBlock v={
        <RCollection layout="VerticalLayout"
          name="Global frame"
          elts={frameElts} />
        }
        valueMemAddr={this.getFrameID()}
      />
    );
  }
}

class StackFrame extends AbstractFrame {
  getFrameID() {
    return 'stack_frame_f' + this.props.data.frame_id;
  }

  render() {
    var frameElts = this.createFrameElements(this.props.data.ordered_varnames,
                                             this.props.data.encoded_locals);
    return (
      // should be wrapped in a RMemBlock so that environment/frame
      // pointers can point to it
      <RMemBlock v={
        <RCollection layout="VerticalLayout"
          name={this.props.data.func_name}
          elts={frameElts} />
        }
        valueMemAddr={this.getFrameID()}
      />
    );
  }
}

class Stack extends React.Component {
  render() {
    // first render globals, and then render each stack frame in order.
    //
    // use frame_id as part of the unique sort key (which is for React's
    // object constancy and *not* part of the object's props!)
    return (
      <div>
        <div key={"stackLabel"}>Frames</div>
        <GlobalFrame globals={this.props.data.globals}
                     ordered_globals={this.props.data.ordered_globals}
                     key={"global_frame"} />

        {this.props.data.stack_to_render.map((c, i) =>
          <StackFrame data={c} key={'stack_frame_f' + c.frame_id} />
        )}
      </div>
    );
  }
}

function show_image(src, width, height, top, bottom, left, right)
{
	// This code is modified from stackoverflow.com/question/5451445/how-to-display-image-with-javascript
        if(current_stoplight != null)
	    {
		document.removeChild(current_stoplight);
	    }
	var img = document.createElement("img");
	img.src = src;
	img.width = width;
	img.height = height;
        img.top = top;
        img.bottom = bottom;
        img.left = left;
        img.right = right;

	current_stoplight = document.body.appendChild(img);
 }


class Heap extends React.Component {
  // just do a super-simple div-based vertical stacking layout for now; expand
  // to a more sophisticated 2-D layout later ...
  //
  // TODO: define clearer nesting vs. external pointing rules
  //
  // for now, use the ID of the FIRST heap object in the row as the key,
  // since it wouldn't change if more objects are appended later in that row.
  // this way, a row would be removed from the virtual DOM only if that first
  // object disappears, which is sensible.
  render() {
    return (
      <div>
        <div key={"heapLabel"}>Objects</div>
        {_.keys(this.props.data).map((heapID, i) =>
          <div key={'heap_obj_' + heapID} style={myStyle.heapRow}>
            {createRMemBlock(this.props.data[heapID], 'heap_obj_' + heapID)}
          </div>
        )}
      </div>
    );
  }
}
