// Rosetta classes start with 'R' so as not to conflict with built-in types

// TODOs:
// - use defaultProps to set default style prop that can be overriden

import React from 'react';

var myStyle = {
  name: {
    fontSize: '8pt',
    color: '#555',
    marginBottom: 2,
  },
  collection: {
    fontFamily: 'verdana, arial, helvetica, sans-serif',
  },
  collectionTd: {
    verticalAlign: 'top',
  },
};


export class RCollection extends React.Component {
  render() {
    if (this.props.layout === 'HorizontalLayout') {
      var res = React.Children.map(this.props.children,
                                  (c) => <td style={myStyle.collectionTd}>{c}</td>);

      return (
        <div className="rcollection" style={myStyle.collection}>
          <div style={myStyle.name}>{this.props.name}</div>
          <table>
            <tbody>
              <tr>
                {res}
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (this.props.layout === 'VerticalLayout') {
      var res = React.Children.map(this.props.children,
                                   (c) => <tr><td style={myStyle.collectionTd}>{c}</td></tr>);

      return (
        <div className="rcollection" style={myStyle.collection}>
          <div style={myStyle.name}>{this.props.name}</div>
          <table>
            <tbody>
              {res}
            </tbody>
          </table>
        </div>
      );
    } else if (this.props.layout === 'GridLayout') {
      console.assert(false); // TODO: implement me
    } else if (this.props.layout === 'TreeLayout') {
      console.assert(false); // TODO: implement me using d3.layout ?
    } else if (this.props.layout === 'GraphLayout') {
      console.assert(false); // TODO: implement me using d3.layout ?
    } else {
      console.assert(false);
    }
  }
}
