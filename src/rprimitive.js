// Rosetta classes start with 'R' so as not to conflict with built-in types

// TODOs:
// - use defaultProps to set default style prop that can be overriden

import React from 'react';

// use the CSS-in-JS approach:
// http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html
var myStyle = {
  primitive: {
    fontFamily: 'verdana, arial, helvetica, sans-serif',
    fontSize: '10pt',
  },
  typeTag: {
    color: '#777',
    fontSize: '8pt',
    marginBottom: 2,
  }
};


// abstract class, don't export
class RPrimitive extends React.Component {
  render() {
    if (this.props.typeTag) {
      return (
        <div style={myStyle.primitive}>
          <div style={myStyle.typeTag}>{this.props.typeTag}</div>
          <div style={this.getStyle()}>{this.renderData()}</div>
        </div>
      );
    } else {
      return (
        <div style={myStyle.primitive}>
          <div style={this.getStyle()}>{this.renderData()}</div>
        </div>
      );
    }
  }

  getStyle() {
    return {}; // null
  }
}

export class RNumber extends RPrimitive {
  renderData() {
    // d3's formatting functions are good for renderNumberFunc to
    // control how numbers are rendered
    return this.props.renderNumberFunc ?
           this.props.renderNumberFunc(this.props.data) :
           String(this.props.data); // no renderer
  }
}

export class RString extends RPrimitive {
  renderData() {
    // to add quotes and escape characters to keep the string rendered
    // in one single line
    return JSON.stringify(this.props.data);
  }

  getStyle() {
    return {
      fontFamily: 'Andale mono, monospace',
      whiteSpace: 'nowrap',
    };
  }
}

export class RSymbol extends RPrimitive {
  renderData() {
    return this.props.data;
  }
}
