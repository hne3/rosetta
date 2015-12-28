// ZOMG got Webpack to work with Babel 6.x

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
        // 1.) react-hot-loader for live browser updates while coding
        // 2.) babel-loader for invoking Babel using cacheDirectory and
        //     the proper presets
        loaders: ['react-hot-loader',
                  'babel-loader?cacheDirectory=webpack_cache/,presets[]=react,presets[]=es2015']
      },
    ]
  }
};
