// Rosetta classes start with 'R' so as not to conflict with built-in types

import React from 'react';

// use the CSS-in-JS approach:
// http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html
var myStyle = {
  rmemblock: {
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


export class RMemBlock extends React.Component {
  // render as a (Han) solo element if used alone; if this is included
  // in a RCollection, it may be rendered specially instead of solo
  render() {
    if (this.props.isVertical) {
      return (
        <table style={myStyle.rmemblock}>
          <tbody>
            <tr><td style={myStyle.indexTd}>{this.props.idx}</td></tr>
            <tr><td style={myStyle.keyTd}>{this.props.k}</td></tr>
            <tr><td style={myStyle.valueTd}>{this.props.v}</td></tr>
            <tr><td style={myStyle.addrTd}>{this.props.valueMemAddr}</td></tr>
          </tbody>
        </table>
      );
    } else {
      return (
        <table style={myStyle.rmemblock}>
          <tbody>
            <tr>
              <td style={myStyle.indexTd}>{this.props.idx}</td>
              <td style={myStyle.keyTd}>{this.props.k}</td>
              <td style={myStyle.valueTd}>{this.props.v}</td>
              <td style={myStyle.addrTd}>{this.props.valueMemAddr}</td>
            </tr>
          </tbody>
        </table>
      );
    }
  }
}

RMemBlock.defaultProps = {
  index: 'idx',
  keyMemAddr: '0xKEY_ADDR',
  valueMemAddr: '0xVAL_ADDR',
  isVertical: true,
};
