require('./environment')

const {resolve} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const values = require('postcss-modules-values')
const htmlWebpackTemplate = require('html-webpack-template')
const ManifestPlugin = require('webpack-manifest-plugin')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
module.exports = (env = {}) => {
  const addItem = (add, item) => add ? item : undefined
  const ifProd = item => addItem(env.prod, item)
  const ifDev = item => addItem(!env.prod, item)
  const removeEmpty = array => array.filter(i => !!i)

  const config = {
    entry: {
      app: removeEmpty([
        ifDev('react-hot-loader/patch'),
        ifDev('webpack-hot-middleware/client?path=/__webpack_hmr'),
        resolve(__dirname, 'client/index.js')
      ]),
      vendor: [
        'react',
        'react-dom',
        'react-relay',
        'react-router',
        'redux',
        'react-redux',
        'redux-thunk',
        'moment'
      ],
      graphiql: resolve(__dirname, 'graphiql/index.js')
    },

    output: {
      filename: env.prod ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: env.prod ? '[name].[chunkhash].js' : '[name].js',
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
          test: /\.html$/,
          loader: 'html',
          query: {
            interpolate: true,
            minimize: false
          }
        },

        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            plugins: removeEmpty([
              ifDev('react-hot-loader/babel'),
              resolve(__dirname, './babelRelayPlugin.js'),
              'transform-class-properties',
              'transform-object-rest-spread'
            ]),
            presets: [
              ['es2015', {modules: false}],
              'react'
            ],
            babelrc: false
          }
        },

        {
          test: /\.(png)$/,
          loader: 'url'
        },

        {
          test: /\.svg$/,
          loader: 'babel?presets[]=es2015,presets[]=react!svg-react'
        },

        ifProd({
          test: /node_modules\/graphiql\/graphiql\.css$/,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css'
          })
        }),

        ifDev({
          test: /node_modules\/graphiql\/graphiql\.css$/,
          loaders: [
            'file?name=[name].[ext]'
          ]
        }),

        ifProd({
          test: /\.css$/,
          exclude: [/graphiql\.css$/],
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
          })
        }),

        ifDev({
          test: /\.css$/,
          exclude: [/graphiql\.css$/],
          loaders: [
            'style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            'postcss-loader'
          ]
        })

      ])
    },

    plugins: removeEmpty([
      new WebpackMd5Hash(),
      new ChunkManifestPlugin({
        filename: 'chunk-manifest.json',
        manifestVariable: "webpackManifest"
      }),
      new ManifestPlugin({
        fileName: 'manifest.json',
        basePath: '/assets/',
        writeToFileEmit: true
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: env.prod ? '[name].[chunkhash].js' : '[name].js',
        chunks: 'app'
      }),
      ifDev(new webpack.HotModuleReplacementPlugin()),

      ifProd(new webpack.optimize.DedupePlugin()),
      ifProd(new webpack.optimize.OccurrenceOrderPlugin()),

      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true
      })),

      ifProd(new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false,
          screw_ie8: true
        }
      })),

      ifProd(new ExtractTextPlugin('[name].[chunkhash].css'), {
        allChunks: false
      }),

      // GraphiQL HTML (graphiql.html)
      new HtmlWebpackPlugin({
        inject: false,
        template: htmlWebpackTemplate,
        title: 'SFU Snap - API Explorer',
        appMountId: 'graphiql',
        links: ['/assets/graphiql.css'],
        chunks: [ 'vendor', 'graphiql' ],
        hash: true,
        filename: resolve(__dirname, 'public/assets/graphiql.html')
      }),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: env.prod ? '"production"' : '"development"',
          GRAPHQL_SERVER: JSON.stringify(process.env.GRAPHQL_SERVER),
          ROOMFINDER_URL: JSON.stringify(process.env.ROOMFINDER_URL || 'https://its-arcgis-web.its.sfu.ca/apps/sfuroomfinder_ios/'),
          MAPBOX_TILES_URL: JSON.stringify(process.env.MAPBOX_TILES_URL)
        }
      })
    ])
  }
  return config
}
