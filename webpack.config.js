// ZOMG getting Webpack to work with Babel 6.x

/*
TODOs:
- package up CSS and other JS library files such as d3 and underscore
- set up:
  https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement

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
        loader: 'babel-loader',
        query: {
          cacheDirectory: '.',
          presets: ['react', 'es2015']
        }
      },
    ]
  }
};
