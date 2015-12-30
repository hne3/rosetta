// Rosetta classes start with 'R' so as not to conflict with built-in types

// TODOs:
// - use defaultProps to set default style prop that can be overriden

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
  render() {
    // should have exactly 1 or 2 children
    // - 1 child:    simply a value
    // - 2 children: a key-value pair
    var nc = React.Children.count(this.props.children);
    console.assert(nc === 1 || nc === 2);

    if (this.props.isVertical) {
      var body = React.Children.map(this.props.children,
                                    (c) => <div className="elementBody">{c}</div>);

      return (
        <div className="element" style={myStyle.element}>
          <div className="elementIndex" style={myStyle.index}>idx</div>
          {body}
          <div className="elementAddr" style={myStyle.memAddr}>0x1234</div>
        </div>
      );
    } else {
      var body = React.Children.map(this.props.children,
                                    (c) => <span className="elementBody">{c}</span>);

      return (
        <div className="element" style={myStyle.element}>
            <span className="elementIndex" style={myStyle.index}>idx</span>
            {body}
            <span className="elementAddr" style={myStyle.memAddr}>0x1234</span>
        </div>
      );
    }
  }
}
