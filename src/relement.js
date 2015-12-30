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
  render() {
    // TODO: render a hanSolo element all by its lonesome :)
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

RElement.defaultProps = {
  index: 'idx',
  memAddr: '0xADDR',
};
