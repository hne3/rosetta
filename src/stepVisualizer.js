// Uses Rosetta to visualize a snapshot of runtime state at one particular step

import React from 'react';

// wow command-line bullshittery:
// https://github.com/sporritt/jsPlumb/issues/399
// reference as jsPlumb after npm installing script-loader and imports-loader
import plumb from 'imports?this=>window!script!../node_modules/jsplumb/dist/js/jsPlumb-2.0.3-min.js';


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


// TODO: look into using multiple jsPlumb instances to manage complexity
// https://jsplumbtoolkit.com/community/doc/home.html#multiple

// TODO: use React component lifecycle methods to re-render jsPlumb after each
// state change: https://facebook.github.io/react/docs/component-specs.html


// TODO: add stack and heap components
export class StepVisualizer extends React.Component {
  render() {
    return (
      <table>
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
