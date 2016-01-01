// Rosetta classes start with 'R' so as not to conflict with built-in types

import React from 'react';

// use the CSS-in-JS approach:
// http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html
var myStyle = {
  relement: {
    fontFamily: 'verdana, arial, helvetica, sans-serif',
  },
  indexTd: {
    fontSize: '8pt',
    color: '#777',
  },
  keyTd: {
  },
  valueTd: {
  },
  addrTd: {
    fontSize: '8pt',
    color: '#777',
  },
};


export class RElement extends React.Component {
  // render as a (Han) solo element if used alone; if this is included
  // in a RCollection, it may be rendered specially instead of solo
  render() {
    if (this.props.isVertical) {
      return (
        <table style={myStyle.relement}>
          <tbody>
            <tr><td style={myStyle.indexTd}>idx</td></tr>
            <tr><td style={myStyle.keyTd}>{this.props.k}</td></tr>
            <tr><td style={myStyle.valueTd}>{this.props.v}</td></tr>
            <tr><td style={myStyle.addrTd}>0x1234</td></tr>
          </tbody>
        </table>
      );
    } else {
      return (
        <table style={myStyle.relement}>
          <tbody>
            <tr>
              <td style={myStyle.indexTd}>idx</td>
              <td style={myStyle.keyTd}>{this.props.k}</td>
              <td style={myStyle.valueTd}>{this.props.v}</td>
              <td style={myStyle.addrTd}>0x1234</td>
            </tr>
          </tbody>
        </table>
      );
    }
  }
}

RElement.defaultProps = {
  index: 'idx',
  memAddr: '0xADDR',
};
