// Rosetta classes start with 'R' so as not to conflict with built-in types

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
