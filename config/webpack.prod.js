const { merge } = require('webpack-merge')
const common = require('./webpack.base')

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  // output: {
  //   publicPath: '/projects/chess3d/',
  // },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
})
