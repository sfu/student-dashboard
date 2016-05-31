const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: [
    `webpack-hot-middleware/client?path=/__webpack_hmr`,
    'webpack/hot/dev-server',
    path.resolve(__dirname, 'client/home.js')
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
