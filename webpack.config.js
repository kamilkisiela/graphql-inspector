var path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './packages/github-actions/src/action.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'action.js',
  },
  resolve: {
    extensions: ['.ts', '.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
};
