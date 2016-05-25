const path = require('path')
const webpack = require('webpack')
const os = require('os')

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    `webpack-dev-server/client?https://${os.hostname()}`,
    path.resolve(__dirname, 'src/client/home.js')
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public/assets'),
    publicPath: '/assets/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: ['es2015', 'react', 'react-hmre'] } }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
