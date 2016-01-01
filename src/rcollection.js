// Rosetta classes start with 'R' so as not to conflict with built-in types

// TODOs:
// - use defaultProps to set default style prop that can be overriden

import React from 'react';
import _ from 'underscore';

// use the CSS-in-JS approach:
// http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html
var myStyle = {
  rcollection: {
    fontFamily: 'verdana, arial, helvetica, sans-serif',
  },
  name: {
    fontSize: '8pt',
    color: '#555',
    marginBottom: 2,
  },
  collectionTable: {
    borderSpacing: 0, // so that cell borders don't have a gap
  },
  indexTd: {
    paddingLeft: 4,
    paddingTop: 2,
    paddingBottom: 3,
    fontSize: '8pt',
    color: '#777',
    borderLeft: '1px solid #555555', // for lists
  },
  keyTd: {
    paddingTop: 0,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    verticalAlign: 'bottom',
    borderBottom: '1px solid #555555', // for lists
    borderLeft: '1px solid #555555',
  },
  valueTd: {
    paddingTop: 0,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    verticalAlign: 'bottom',
    borderBottom: '1px solid #555555', // for lists
    borderLeft: '1px solid #555555',
  },
  addrTd: {
    paddingLeft: 4,
    paddingTop: 2,
    paddingBottom: 3,
    fontSize: '8pt',
    color: '#777',
    borderLeft: '1px solid #555555', // for lists
  },
  gridCellTd: {},
};


export class RCollection extends React.Component {
  render() {
    if (this.props.layout === 'HorizontalLayout') {
      // render each part of each element separately so that table rows
      // and columns align properly across elements ...
      return (
        <div style={myStyle.rcollection}>
          <div style={myStyle.name}>{this.props.name}</div>
          <table style={myStyle.collectionTable}>
            <tbody>
              <tr>
              {this.props.elts.map((c, i) =>
                <td style={myStyle.indexTd} key={c.key}>{c.props.index}</td>)}
              </tr>
              <tr>
              {this.props.elts.map((c, i) =>
                <td style={myStyle.keyTd} key={c.key}>{c.props.k}</td>)}
              </tr>
              <tr>
              {this.props.elts.map((c, i) =>
                <td style={myStyle.valueTd} key={c.key}>{c.props.v}</td>)}
              </tr>
              <tr>
              {this.props.elts.map((c, i) =>
                <td style={myStyle.addrTd} key={c.key}>{c.props.memAddr}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (this.props.layout === 'VerticalLayout') {
      // render each part of each element separately so that table rows
      // and columns align properly across elements ...
      return (
        <div style={myStyle.rcollection}>
          <div style={myStyle.name}>{this.props.name}</div>
          <table style={myStyle.collectionTable}>
            <tbody>
            {this.props.elts.map((c, i) =>
              <tr key={c.key}>
                <td style={myStyle.indexTd}>{c.props.index}</td>
                <td style={myStyle.keyTd}>{c.props.k}</td>
                <td style={myStyle.valueTd}>{c.props.v}</td>
                <td style={myStyle.addrTd}>{c.props.memAddr}</td>
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
                ret = <td style={myStyle.gridCellTd} key={j}>{this.props.elts[idx]}</td>;
              }
              idx++;
              return ret;
            })
          }
          </tr>);
      });

      return (
        <div style={myStyle.rcollection}>
          <div style={myStyle.name}>{this.props.name}</div>
          <table style={myStyle.collectionTable}>
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
