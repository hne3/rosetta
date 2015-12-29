// Rosetta classes start with 'R' so as not to conflict with built-in types

import React from 'react';

export class RCollection extends React.Component {
  render() {
    if (this.props.layout === 'HorizontalLayout') {
      var res = React.Children.map(this.props.children, (c) => {
        return <td>{c}</td>;
      });
      return (
        <div>
          <div>{this.props.name}</div>
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
      var res = React.Children.map(this.props.children, (c) => {
        return <tr><td>{c}</td></tr>;
      });
      return (
        <div>
          <div>{this.props.name}</div>
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
