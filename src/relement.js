// Rosetta classes start with 'R' so as not to conflict with built-in types

import React from 'react';

var myStyle = {
  element: {

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
  render() {
    // should have exactly 1 or 2 children
    // - 1 child:    simply a value
    // - 2 children: a key-value pair
    var nc = React.Children.count(this.props.children);
    console.assert(nc === 1 || nc === 2);

    if (this.props.isVertical) {
      var body = React.Children.map(this.props.children,
                                    (c) => <tr><td>{c}</td></tr>);

      return (
        <table className="element" style={myStyle.element}>
          <tbody>
          <tr><td style={myStyle.index}>idx</td></tr>
          {body}
          <tr><td style={myStyle.memAddr}>0x1234</td></tr>
          </tbody>
        </table>
      );
    } else {
      var body = React.Children.map(this.props.children,
                                    (c) => <td>{c}</td>);

      return (
        <table className="element" style={myStyle.element}>
          <tbody>
          <tr>
            <td style={myStyle.index}>idx</td>
            {body}
            <td style={myStyle.memAddr}>0x1234</td>
          </tr>
          </tbody>
        </table>
      );
    }
  }
}
