module.exports = {
  entry: './src/app.js',
  target: 'node',
  output: {
    path: './dist',
    filename: './app.js',
    libraryTarget: 'commonjs',
  },
  externals: [
    /^(?!\.|\/).+/i,
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
