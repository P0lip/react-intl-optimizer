const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactIntlOptimizer = require('react-intl-optimizer');

module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, './src/index.jsx')],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 10,
      minChunks: 1,
      name: true,
      cacheGroups: {
        messages: {
          test: /messages\.js$/,
          name: 'messages',
          // the above is important from performance (build time) point of view
          // I'll optimize the plugin a bit later. It's run only in production, though,
          // so dev build shouldn't affected at all
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /.jsx?/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/env', { modules: false }], '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index.html',
    }),
    new ReactIntlOptimizer({
      messages: require('./messages/index.json'),
      defaultLanguage: 'en',
      chunkName: 'messages',
      // must match cache group ^
      optimization: {
        // see README for the list of optimizations
        inlineDefaultLanguage: true,
        minifyIDs: true,
        mergeDuplicates: true,
        removeUnused: true,
      },
    }),
  ],
};
