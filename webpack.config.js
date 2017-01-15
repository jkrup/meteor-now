const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: './dist',
    filename: './index.js',
    libraryTarget: 'commonjs',
  },
  externals: [
    /^(?!\.|\/).+/i,
  ],
  plugins: [
    // adds #!/usr/bin/env node at the top of bundle file
    new webpack.BannerPlugin('#!/usr/bin/env node', { raw: true })
  ],
  module: {
    preLoaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.md$/, loader: 'ignore-loader' },
      { test: /LICENSE$/, loader: 'ignore-loader' },
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
};
