const baseConfig = require('./webpack.base.config')
const { merge } = require('webpack-merge');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    port: 8000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
})
