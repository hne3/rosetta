class Foo { // this is ES6 syntax!
  constructor(msg) {
    this.msg = msg;
  }
  speak() {
    console.log(this.msg);
  }
}

ReactDOM.render(
  <h1>Hello world, React!</h1>, // this is React's JSX syntax!
  document.getElementById('example')
);

var f = new Foo('Hi there, console!');
f.speak();
