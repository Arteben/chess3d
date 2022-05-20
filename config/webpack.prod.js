const { merge } = require('webpack-merge')
const common = require('./webpack.base')

// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  // module: {
  //   rules: [
  //     {
  //       test: /\.(c|sa|sc)ss$/i,
  //       use: [
  //         MiniCssExtractPlugin.loader,
  //         'style-loader',
  //         {
  //           loader: 'css-loader',
  //           options: { importLoaders: 1 },
  //         },
  //         'sass-loader',
  //       ],
  //     },
  //   ],
  // },
  plugins: [
    new CleanWebpackPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: 'css/[name].[contenthash].css',
    //   chunkFilename: 'css/[id].[contenthash].css',
    // }),
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
