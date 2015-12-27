// Rosetta classes start with 'R'

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
}

class RNumber extends RPrimitive {
  renderData() {
    return String(this.props.data);
  }

  getStyle() {
    return {
      backgroundColor: 'blue'
    };
  }
}

class RString extends RPrimitive {
  renderData() {
    // to add quotes and escape characters to keep the string rendered
    // in one single line
    return JSON.stringify(this.props.data);
  }

  getStyle() {
    return {
      backgroundColor: 'steelBlue'
    };
  }
}

class RSymbol extends RPrimitive {
  renderData() {
    return this.props.data;
  }

  getStyle() {
    if (this.props.style) {
      return this.props.style;
    } else {
      return {
        backgroundColor: 'gray'
      };
    }
  }
}


ReactDOM.render(
  <RNumber typeTag="unsigned long" data={-1234567890} />,
  document.getElementById("primitiveDiv1")
);

ReactDOM.render(
  <RString typeTag="str" data={"Hello, <b>world!</b>"} />,
  document.getElementById("primitiveDiv2")
);

ReactDOM.render(
  <RSymbol typeTag="bool" style={{backgroundColor: 'purple'}} data={"True"} />,
  document.getElementById("primitiveDiv3")
);
