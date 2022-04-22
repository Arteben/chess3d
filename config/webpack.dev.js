const paths = require('./paths')

const webpack = require('webpack')
const { merge } = require('webpack-merge')

const common = require('./webpack.base')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  devServer: {
    static: {
      directory: paths.build,
    },
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
})
