const {resolve} = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const values = require('postcss-modules-values')

module.exports = (env = {}) => {
  const addItem = (add, item) => add ? item : undefined
  const ifProd = item => addItem(env.prod, item)
  const ifDev = item => addItem(!env.prod, item)
  const removeEmpty = array => array.filter(i => !!i)

  const config = {
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
      extensions: ['', '.js', '.jsx'],
      modules: [
        resolve(__dirname, 'client'),
        resolve(__dirname, 'queries'),
        resolve(__dirname, 'node_modules')
      ]
    },
    postcss() {
      return [values, autoprefixer]
    },

    module: {
      loaders: removeEmpty([
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            plugins: removeEmpty([
              ifDev('react-hot-loader/babel'),
              resolve(__dirname, './babelRelayPlugin.js'),
              'transform-class-properties'
            ]),
            presets: [
              ['es2015', {modules: false}],
              'react'
            ],
            babelrc: false
          }
        },

        {
          test: /\.(png|svg)$/,
          loader: 'url'
        },

        ifProd({
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
          })
        }),

        ifDev({
          test: /\.css$/,
          loaders: [
            'style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            'postcss-loader'
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
  return config
}
