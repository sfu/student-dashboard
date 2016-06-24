const {resolve} = require('path')
const webpack = require('webpack')

module.exports = (env = {}) => {
  const addItem = (add, item) => add ? item : undefined
  const ifProd = item => addItem(env.prod, item)
  const ifDev = item => addItem(!env.prod, item)
  const removeEmpty = array => array.filter(i => !!i)

  return {
    entry: removeEmpty([
      ifDev('webpack-hot-middleware/client?path=/__webpack_hmr'),
      ifDev('webpack/hot/dev-server'),
      resolve(__dirname, 'client/home.js')
    ]),

    output: {
      filename: 'app.js',
      path: resolve(__dirname, 'public/assets'),
      publicPath: '/assets/'
    },

    devtool: env.prod ? 'source-map' : 'eval',

    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets:
            removeEmpty([
              'babel-preset-es2015-native-modules',
              'react',
              ifDev('react-hmre')
            ])
          }
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loaders: ['style', 'css?modules', 'sass']
        }
      ]
    },

    plugins: removeEmpty([
      ifDev(new webpack.HotModuleReplacementPlugin()),

      ifProd(new webpack.optimize.DedupePlugin()),
      ifProd(new webpack.optimize.OccurrenceOrderPlugin()),

      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true
      })),


      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true
        }
      })),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: env.prod ? '"production"' : '"development"'
        }
      })
    ])

  }
}
