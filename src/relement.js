// Rosetta classes start with 'R' so as not to conflict with built-in types

import React from 'react';

var myStyle = {
  element: {
    fontFamily: 'verdana, arial, helvetica, sans-serif',
  },
  index: {
    /*
    paddingLeft: 4,
    paddingTop: 2,
    paddingBottom: 3,
    */
    fontSize: '8pt',
    color: '#777',
  },
  memAddr: {
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
        <table>
          <tbody>
            <tr><td className="elementIndex" style={myStyle.index}>idx</td></tr>
            <tr><td className="elementKey">{this.props.k}</td></tr>
            <tr><td className="elementValue">{this.props.v}</td></tr>
            <tr><td className="elementAddr" style={myStyle.memAddr}>0x1234</td></tr>
          </tbody>
        </table>
      );
    } else {
      return (
        <table>
          <tbody>
            <tr>
              <td className="elementIndex" style={myStyle.index}>idx</td>
              <td className="elementKey">{this.props.k}</td>
              <td className="elementValue">{this.props.v}</td>
              <td className="elementAddr" style={myStyle.memAddr}>0x1234</td>
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
