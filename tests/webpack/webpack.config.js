const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ReactIntlOptimizer = require('../../dist');

module.exports = {
  entry: {
    test: path.resolve(__dirname, '../fixtures/test.file.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../.cache'),
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: true,
        },
        parallel: false,
        cache: false,
        sourceMap: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/env', { modules: false }]],
          },
        },
      },
    ],
  },
  plugins: [
    new ReactIntlOptimizer({
      messages: require('../fixtures/messages/sample-0'),
      defaultLanguage: 'en',
      optimization: {
        inlineDefaultLanguage: true,
        minifyIDs: true,
        mergeDuplicates: true,
        removeUnused: true,
      },
    }),
  ],
  externals: {
    react: 'react',
  },
};
