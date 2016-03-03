/* eslint no-console: 0 */
import express from 'express'
import path from 'path'
import graphQLHTTP from 'express-graphql'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

const Schema = null

const APP_PORT = 3000
const GRAPHQL_PORT = 8080

const graphQLServer = express()
graphQLServer.disable('x-powered-by')
graphQLServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema
}))


const compiler = webpack({
  entry: path.resolve(__dirname, 'modules', 'app.js'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/
      }
    ]
  },
  output: {filename: 'app.js', path: '/'}
})

const server = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/js/',
  stats: {colors: true}
})

server.use('/', express.static(path.resolve(__dirname, 'public')))

server.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`)
})
