// Rosetta classes start with 'R' so as not to conflict with built-in types

// TODOs:
// - maybe render as a simple <td></td> instead of a full table so that
//   it's easily embeddable in other elements; however if the 'hanSolo' prop
//   is enabled, then render this as a solo element with a surrounding
//   <table></table>. this way, there aren't too many unnecessary levels
//   of table nesting when placed in a RCollection

import React from 'react';

export class RElement extends React.Component {
  render() {
    // should have exactly 1 or 2 children
    // - 1 child:    simply a value
    // - 2 children: a key-value pair
    var nc = React.Children.count(this.props.children);
    console.assert(nc === 1 || nc === 2);

    if (this.props.isVertical) {
      var body = React.Children.map(this.props.children, (c) => {
        return <tr><td>[body: {c} ]</td></tr>;
      });

      return (
        <table>
          <tbody>
          <tr><td>[index]</td></tr>
          {body}
          <tr><td>[memaddr]</td></tr>
          </tbody>
        </table>
      );
    } else {
      var body = React.Children.map(this.props.children, (c) => {
        return <td>[body: {c} ]</td>;
      });

      return (
        <table>
          <tbody>
          <tr>
            <td>[index]</td>
            {body}
            <td>[memaddr]</td>
          </tr>
          </tbody>
        </table>
      );
    }
  }
}
