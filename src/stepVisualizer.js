// Uses Rosetta to visualize a snapshot of runtime state at one particular step

import React from 'react';

// wow command-line bullshittery:
// https://github.com/sporritt/jsPlumb/issues/399
// reference as jsPlumb after npm installing script-loader and imports-loader
import plumb from 'imports?this=>window!script!../node_modules/jsplumb/dist/js/jsPlumb-2.0.3-min.js';

import 'd3';


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
              <Heap data={this.props.data}/>
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

class GlobalFrame extends React.Component {
  render() {
    console.log('GlobalFrame:', this.props.ordered_globals, this.props.globals);
    // TODO: return a RCollection with VerticalLayout
    return <div>Global Frame!!!</div>
  }
}

class StackFrame extends React.Component {
  render() {
    console.log('StackFrame:', this.props.data);
    // TODO: return a RCollection with VerticalLayout
    return <div>Stack Frame!!!</div>
  }
}

class Stack extends React.Component {
  render() {
    // first render globals, and then render each stack frame in order
    // each StackFrame should have a unique frame ID to use as the key
    return (
      <div>
        <div key={"stackLabel"}>Frames</div>

        <div key={"global_frame"} style={myStyle.stackFrame}>
          <GlobalFrame globals={this.props.data.globals}
                       ordered_globals={this.props.data.ordered_globals} />
        </div>
        {this.props.data.stack_to_render.map((c, i) =>
          <div key={"stack_frame_id" + c.frame_id} style={myStyle.stackFrame}>
            <StackFrame data={c} />
          </div>
        )}
      </div>
    );
  }
}

class Heap extends React.Component {
  // just do a super-simple div-based vertical stacking layout for now; expand
  // to a 2-D layout later ...
  //
  // TODO: make a better key for heap rows ...
  render() {
    //console.log('Heap:', this.props.data);
    return (
      <div>HEAP!!!</div>
      /*
      <div>
        <div key={"heapLabel"}>Objects</div>
        {this.props.elts.map((c, i) =>
          <div key={i} style={myStyle.heapRow}>{c}</div>)
        }
      </div>
      */
    );
  }
}
