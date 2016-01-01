// Uses Rosetta to visualize a snapshot of runtime state at one particular step

import React from 'react';

// wow command-line bullshittery:
// https://github.com/sporritt/jsPlumb/issues/399
// reference as jsPlumb after npm installing script-loader and imports-loader
import plumb from 'imports?this=>window!script!../node_modules/jsplumb/dist/js/jsPlumb-2.0.3-min.js';


// TODO: look into using multiple jsPlumb instances to manage complexity
// https://jsplumbtoolkit.com/community/doc/home.html#multiple

// TODO: use React component lifecycle methods to re-render jsPlumb after each
// state change: https://facebook.github.io/react/docs/component-specs.html


// TODO: add stack and heap components
export class StepVisualizer extends React.Component {
  render() {
    return (
      <div>[yoooo stepper!]</div>
    );
  }
}

class Stack extends React.Component {
}

class Heap extends React.Component {
}
