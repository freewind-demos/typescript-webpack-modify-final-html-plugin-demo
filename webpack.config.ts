import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackModifyFinalHtmlPlugin from './src/webpack-modify-final-html-plugin';

module.exports = {
  mode: 'development',
  entry: './entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new WebpackModifyFinalHtmlPlugin({
      enable: true,
      modify: (html, assetSources) => {
        return html.replace('<<placeholder>>', JSON.stringify(assetSources['bundle.js']));
      }
    })
  ]
}
