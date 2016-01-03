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


// TODO: maybe use custom events (e.g., a simple version of Flux?) to
// pass notifications of pointer start/end nodes UP from children to parents?

// TODO: use React component lifecycle methods to re-render jsPlumb after each
// state change: https://facebook.github.io/react/docs/component-specs.html

// TODO: have this class parse the execution trace at a particular
// program point and "own" all the pointers so that it can re-render on
// every state update
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
            renderNumberFunc={(x) => d3.round(x, 0)} />
  }
  else if (typ === "boolean") {
    // TODO: different spellings for different languages ...
    // e.g., 'true' for JS, but 'True' for Python
    ret = <RSymbol typeTag="bool" data={obj ? "True" : "False"} />;
  }
  else if (typ === "string") {
    ret = <RString data={obj} />;
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

// returns an instance of RPrimitive or RCollection
function createRosettaCompoundObject(obj, memAddr) {
  var ret = undefined;

  console.assert(typeof obj == "object");
  if (obj[0] === 'REF') {
    console.assert(obj.length === 2);
    ret = <RPointer
            typeTag="ref"
            data={{start: '??? ' + memAddr,
                   end:   'obj_' + getRefID(obj)}} />;
  } else if (obj[0] === 'LIST') {
    // list     - ['LIST', elt1, elt2, elt3, ..., eltN]
    // use the list index as the faux memory address
    ret = <RCollection layout="HorizontalLayout"
            name="list"
            elts={_.rest(obj).map((c, i) =>
              createRMemBlock(c, memAddr + '_e' + i))} />;
  } else if (obj[0] === 'TUPLE') {
    // tuple    - ['TUPLE', elt1, elt2, elt3, ..., eltN]
    // use the tuple index as the faux memory address
    ret = <RCollection layout="HorizontalLayout"
            name="tuple"
            elts={_.rest(obj).map((c, i) =>
              createRMemBlock(c, memAddr + '_e' + i))} />;
  } else if (obj[0] === 'SET') {
    // set      - ['SET', elt1, elt2, elt3, ..., eltN]
    // TODO: heuristically compute ncols based on size of set

    // TODO: what should we use as memAddr for each element?
    // maybe memAddr + '_hash_' + JSON.stringify(obj) for key since sets have unique keys
  } else if (obj[0] === 'DICT') {
    // dict     - ['DICT', [key1, value1], [key2, value2], ..., [keyN, valueN]]
    // ret =
    // TODO: how about creating a RMemBlock with isVertical = false?
  } else if (obj[0] === 'INSTANCE') {
    // instance - ['INSTANCE', class name, [attr1, value1], [attr2, value2], ..., [attrN, valueN]]
    // ret =
  } else if (obj[0] === 'INSTANCE_PPRINT') {
    // instance with __str__ defined - ['INSTANCE_PPRINT', class name, <__str__ value>]
    // ret =
  } else if (obj[0] === 'CLASS') {
    // class    - ['CLASS', class name, [list of superclass names], [attr1, value1], [attr2, value2], ..., [attrN, valueN]]
    // ret =
  } else if (obj[0] === 'FUNCTION') {
    // function - ['FUNCTION', function name, parent frame ID (for nested functions)]
    // TODO: support parent frame ID
    console.assert(obj.length === 3);
    ret = <RSymbol typeTag="function" data={obj[1]} />;
  } else if (obj[0] === 'module') {
    // module   - ['module', module name]
    console.assert(obj.length === 2);
    ret = <RSymbol typeTag="module" data={obj[1]} />;
  } else {
    // other    - [<type name>, string representation of object]
    console.assert(obj.length === 2);
    ret = <RSymbol typeTag={obj[0]} data={obj[1]} />;
  }

  console.assert(ret);
  return ret;
}

// TODO: specialize for each language ...
// returns a RMemBlock that wraps obj, located at memAddr
function createRMemBlock(obj, memAddr, isVertical=true) {
  console.assert(memAddr); // should have a valid address!

  var ret = isPrimitiveType(obj) ?
    createRosettaPrimitive(obj) :
    createRosettaCompoundObject(obj, memAddr);

  // NB: key and valueMemAddr seem redundant but they're both necessary
  // since 'key' isn't part of this.props; it's for React internals
  return (
    <RMemBlock v={ret}
      key={memAddr} valueMemAddr={memAddr}
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
