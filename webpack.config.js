const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProd ? 'bundle.[contenthash].js' : 'bundle.js',
    clean: true,
  },
  module: {
    rules: [{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: isProd ? 'style.[contenthash].css' : 'style.css' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '.' },
        { from: 'src/icons', to: 'icons' },
      ],
    }),
    new InjectManifest({ swSrc: './src/sw.js', swDest: 'sw.js' }),
  ],
  devServer: { open: true, port: 8080, devMiddleware: { writeToDisk: true } },
};