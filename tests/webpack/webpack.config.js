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
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: true,
        },
        parallel: false,
        cache: false,
        sourceMap: true,
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 1000,
      minChunks: 2,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /react-intl/,
          name: 'react-intl',
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
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

  ],
  externals: {
    react: 'react',
  },
};
