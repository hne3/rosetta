// ZOMG getting Webpack to work with Babel 6.x

/*
TODOs:
- package up CSS and other JS library files such as d3 and underscore

*/

var path = require('path');

module.exports = {
  entry: './src/rosetta.js',
  output: {
    filename: 'bundle.js'
  },
  // when importing from src/<file>.js, only need to specify as <file>
  resolve: {
    root: path.resolve('./src'), // needs to be an absolute path
    extensions: ['', '.js']
  },
  devtool: 'source-map', // generate source helps to aid debugging
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory,presets[]=react,presets[]=es2015'
      },
    ]
  }
};
