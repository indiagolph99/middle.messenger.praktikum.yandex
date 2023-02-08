const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const rootDir = path.resolve(__dirname, '..');

module.exports = {
  entry: path.resolve(rootDir, 'src', 'index.ts'),
  output: {
    path: path.resolve(rootDir, 'dist'),
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      $api: path.resolve(rootDir, 'src', 'api'),
      $components: path.resolve(rootDir, 'src', 'components'),
      $controllers: path.resolve(rootDir, 'src', 'controllers'),
      $core: path.resolve(rootDir, 'src', 'core'),
      $pages: path.resolve(rootDir, 'src', 'pages'),
      $utils: path.resolve(rootDir, 'src', 'utils'),
      handlebars: 'handlebars/dist/handlebars.min.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(rootDir, 'tsconfig.json'),
            },
          },
        ],
        exclude: /(node_modules)/
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'src', 'index.html'),
      inject: 'body',
    }),
    new CopyPlugin({
      patterns: [{ from: 'static', to: '.' }],
    }),
  ],
};
