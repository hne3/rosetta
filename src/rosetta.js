// Rosetta
// Created on 2015-12-27 by Philip Guo

// Rosetta classes start with 'R' to not conflict with built-in types

/* TODOs

- remember to add 'key' field for object constancy

*/


// abstract class
class RPrimitive extends React.Component {
  render() {
    if (this.props.typeTag) {
      return (
        <div className="primitive">
          <div className="typeTag">{this.props.typeTag}</div>
          <div style={this.getStyle()}>{this.renderData()}</div>
        </div>
      );
    } else {
      return (
        <div className="primitive">
          <div style={this.getStyle()}>{this.renderData()}</div>
        </div>
      );
    }
  }

  // override to customize style
  getStyle() {
    if (this.props.customStyle) {
      return this.props.customStyle;
    } else {
      return {
        backgroundColor: 'gray'
      };
    }
  }
}

class RNumber extends RPrimitive {
  renderData() {
    // d3's formatting functions are good for renderNumberFunc to
    // control how numbers are rendered
    return this.props.renderNumberFunc ?
           this.props.renderNumberFunc(this.props.data) :
           String(this.props.data); // no renderer
  }
}

class RString extends RPrimitive {
  renderData() {
    // to add quotes and escape characters to keep the string rendered
    // in one single line
    return JSON.stringify(this.props.data);
  }
}

class RSymbol extends RPrimitive {
  renderData() {
    return this.props.data;
  }
}


ReactDOM.render(
  <RNumber typeTag="float"
           data={123.4567890}
           renderNumberFunc={(x) => d3.round(x, 3)} />,
  document.getElementById("primitiveDiv1")
);

ReactDOM.render(
  <RString data={"Hello, <b>world!</b>"} />,
  document.getElementById("primitiveDiv2")
);

ReactDOM.render(
  <RSymbol typeTag="bool"
           data={"True"}
           customStyle={{backgroundColor: 'purple'}} />,
  document.getElementById("primitiveDiv3")
);

ReactDOM.render(
  <RNumber typeTag="int"
           data={-123.4567890}
           renderNumberFunc={(x) => d3.round(x, 0)} />,
  document.getElementById("primitiveDiv4")
);

ReactDOM.render(
  <RSymbol data={"globalX"} />,
  document.getElementById("primitiveDiv5")
);
