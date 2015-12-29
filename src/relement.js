// Rosetta classes start with 'R' so as not to conflict with built-in types

/*
TODOs:
  - should RElement contain keys/values as children nodes in the tree,
    or use attributes in this.props?
*/

import React from 'react';

export class RElement extends React.Component {
  render() {
    if (this.props.isVertical) {
      var myKey = (this.props.eKey ?
        <tr>
          <td>[key: {this.props.eKey}]</td>
        </tr>
        : undefined);

      return (
        <table>
          <tbody>
          <tr>
            <td>[index]</td>
          </tr>
          {myKey}
          <tr>
            <td>[value: {this.props.eValue}]</td>
          </tr>
          <tr>
            <td>[memaddr]</td>
          </tr>
          </tbody>
        </table>
      );
    } else {
      var myKey = (this.props.eKey ?
          <td>[key: {this.props.eKey}]</td>
        : undefined);

      return (
        <table>
          <tbody>
          <tr>
            <td>[index]</td>
            {myKey}
            <td>[value: {this.props.eValue}]</td>
            <td>[memaddr]</td>
          </tr>
          </tbody>
        </table>
      );
    }
  }
}
