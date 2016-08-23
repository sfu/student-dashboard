const {resolve} = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (env = {}) => {
  const addItem = (add, item) => add ? item : undefined
  const ifProd = item => addItem(env.prod, item)
  const ifDev = item => addItem(!env.prod, item)
  const removeEmpty = array => array.filter(i => !!i)

  return {
    entry: removeEmpty([
      ifDev('react-hot-loader/patch'),
      ifDev('webpack-hot-middleware/client?path=/__webpack_hmr'),
      resolve(__dirname, 'client/index.js')
    ]),

    output: {
      filename: 'app.js',
      path: resolve(__dirname, 'public/assets'),
      publicPath: '/assets/'
    },

    devtool: env.prod ? 'source-map' : 'eval',

    resolve: {
      modules: [
        resolve('./client'),
        resolve('./node_modules')
      ]
    },

    module: {
      loaders: removeEmpty([
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            plugins: [
              ifDev('react-hot-loader/babel'),
              resolve(__dirname, './babelRelayPlugin.js'),
              'transform-class-properties'
            ],
            presets: removeEmpty([
              ['es2015', {modules: false}],
              'react'
            ])
          }
        },

        {
          test: /\.(png|svg)$/,
          loader: 'url'
        },

        ifProd({
          test: /\.scss$/,
          exclude: /node_modules/,
          loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass')
        }),

        ifDev({
          test: /\.scss$/,
          exclude: /node_modules/,
          loaders: [
            'style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass'
          ]
        })

      ])
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

      ifProd(new ExtractTextPlugin('styles.css'), {
        allChunks: true
      }),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: env.prod ? '"production"' : '"development"'
        }
      })
    ])

  }
}
