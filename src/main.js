// ES6 class component:
// https://facebook.github.io/react/docs/reusable-components.html#es6-classes
// http://babeljs.io/blog/2015/06/07/react-on-es6-plus/
class HelloMessage extends React.Component {
  // constructor is componentWillMount
  constructor(props) {
    super(props);

    // Operations usually carried out in componentWillMount go here
    console.log("constructor / componentWillMount");

    // this.state = ; // initialize state here
  }

  render() {
    return (
      <div>
        <h1>Hello {this.props.name}</h1>
        <StatelessComponent moniker={this.props.name}/>
      </div>
    );
  }
}

// Stateless function: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
function StatelessComponent(props) {
  return <h2>I am stateless {props.moniker}</h2>;
}

// set propTypes and defaultProps here
HelloMessage.propTypes = { initialCount: React.PropTypes.number };
HelloMessage.defaultProps = { initialCount: 0 };

ReactDOM.render(
  <HelloMessage name={"Philip " + 3 + " Guo"}/>,
  document.getElementById('example')
);
