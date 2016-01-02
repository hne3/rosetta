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


// TODO: look into using multiple jsPlumb instances to manage complexity
// https://jsplumbtoolkit.com/community/doc/home.html#multiple

// TODO: use React component lifecycle methods to re-render jsPlumb after each
// state change: https://facebook.github.io/react/docs/component-specs.html


// TODO: add stack and heap components
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
              <Stack elts={this.props.stackElts}/>
            </td>
            <td style={myStyle.heapTd}>
              <Heap elts={this.props.heapElts}/>
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

export class StackFrame extends React.Component {
  render() {
    return this.props.content;
  }
}

class Stack extends React.Component {
  render() {
    // each StackFrame should have a unique frame ID to use as the key
    return (
      <div>
        <div key={"stackLabel"}>Frames</div>
        {this.props.elts.map((c, i) =>
          <div key={c.props.frameId} style={myStyle.stackFrame}>{c}</div>)
        }
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
    return (
      <div>
        <div key={"heapLabel"}>Objects</div>
        {this.props.elts.map((c, i) =>
          <div key={i} style={myStyle.heapRow}>{c}</div>)
        }
      </div>
    );
  }
}
