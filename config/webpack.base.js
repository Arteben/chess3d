/* eslint-disable no-undef */
const paths = require('./paths')

const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env'],
  },
}

module.exports = {
  entry: `${paths.src}/main.js`,
  output: {
    path: paths.build,
    filename: 'js/[name].bundle.js',
    publicPath: '/',
    clean: true,
    crossOriginLoading: 'anonymous',
    module: true,
    environment: {
      arrowFunction: true,
      bigIntLiteral: false,
      const: true,
      destructuring: true,
      dynamicImport: false,
      forOf: true,
    },
  },
  resolve: {
    alias: {
      '@': `${paths.src}`,
    },
    extensions: ['.js', '.ts'],
  },
  experiments: {
    topLevelAwait: true,
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // JavaScript
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: babelLoader,
      },
      // TypeScript
      {
        test: /\.ts$/i,
        exclude: /node_modules/,
        use: [babelLoader, 'ts-loader'],
      },
      // CSS, SASS
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'sass-loader',
        ],
      },
      // MD
      {
        test: /\.md$/i,
        use: ['html-loader'],
      },
      // static files
      {
        test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2?)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.ProgressPlugin(),

    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: `${paths.public}/`,
    //     },
    //   ],
    // }),

    new HtmlWebpackPlugin({
      template: 'template.html',
      filename: 'index.html',
    }),
  ],
}
