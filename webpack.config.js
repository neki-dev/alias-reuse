const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['.ts'],
  },
  entry: [
    path.resolve(__dirname, 'src/index.ts'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'umd',
    }
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
    }],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: { comments: false },
        },
      }),
    ],
  },
};
