// Rosetta classes start with 'R' so as not to conflict with built-in types

// TODOs:
// - use defaultProps to set default style prop that can be overriden

import React from 'react';

import _ from 'underscore';


var myStyle = {
  name: {
    fontSize: '8pt',
    color: '#555',
    marginBottom: 2,
  },
  collection: {
    fontFamily: 'verdana, arial, helvetica, sans-serif',
  },
};


export class RCollection extends React.Component {
  render() {
    if (this.props.layout === 'HorizontalLayout') {
      // render each part of each element separately so that table rows
      // and columns align properly across elements ...
      return (
        <div className="rcollection" style={myStyle.collection}>
          <div style={myStyle.name}>{this.props.name}</div>
          <table>
            <tbody>
              <tr>
              {this.props.elts.map((c, i) =>
                <td key={c.key}>{c.props.index}</td>)}
              </tr>
              <tr>
              {this.props.elts.map((c, i) =>
                <td key={c.key}>{c.props.k}</td>)}
              </tr>
              <tr>
              {this.props.elts.map((c, i) =>
                <td key={c.key}>{c.props.v}</td>)}
              </tr>
              <tr>
              {this.props.elts.map((c, i) =>
                <td key={c.key}>{c.props.memAddr}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (this.props.layout === 'VerticalLayout') {
      // render each part of each element separately so that table rows
      // and columns align properly across elements ...
      return (
        <div className="rcollection" style={myStyle.collection}>
          <div style={myStyle.name}>{this.props.name}</div>
          <table>
            <tbody>
            {this.props.elts.map((c, i) =>
              <tr key={c.key}>
                <td>{c.props.index}</td>
                <td>{c.props.k}</td>
                <td>{c.props.v}</td>
                <td>{c.props.memAddr}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      );
    } else if (this.props.layout === 'GridLayout') {
      // use this.props.ncols to determine number of columns in grid,
      // then render each element inside as a solo element
      console.assert(this.props.ncols > 0); // make sure this is positive!
      var ncols = this.props.ncols;
      var nrows = Math.floor((this.props.elts.length - 1) / ncols) + 1;
      var idx = 0;

      // iterate over nrows, then ncols
      // (using i and j for keys is crap, but whateves)
      var tblBody = _.range(nrows).map((c, i) => {
        return (
          <tr key={i}>
          {
            _.range(ncols).map((c, j) => {
              var ret = <td key={j}>[EMPTY]</td>;
              if (idx < this.props.elts.length) {
                ret = <td key={j}>{this.props.elts[idx]}</td>;
              }
              idx++;
              return ret;
            })
          }
          </tr>);
      });

      return (
        <div className="rcollection" style={myStyle.collection}>
          <div style={myStyle.name}>{this.props.name}</div>
          <table>
            <tbody>
              {tblBody}
            </tbody>
          </table>
        </div>
      );
    } else if (this.props.layout === 'TreeLayout') {
      console.assert(false); // TODO: implement me using d3.layout ?
    } else if (this.props.layout === 'GraphLayout') {
      console.assert(false); // TODO: implement me using d3.layout ?
    } else {
      console.assert(false);
    }
  }
}
