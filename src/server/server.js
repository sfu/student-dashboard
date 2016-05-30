import express from 'express'
import session from 'express-session'
import {sync as uid} from 'uid-safe'
import helmet from 'helmet'
import path from 'path'
import * as routes from './routes'
import webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import devErrorHandler from 'errorhandler'
import ConnectRedis from 'connect-redis'
const RedisStore = ConnectRedis(session)

const PRODUCTION = process.env.NODE_ENV === 'production'

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_COOKIE_NAME || 'connect.sid',
  cookie: {
    secure: true
  },
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({
    url: process.env.SESSION_STORE_REDIS_URL
  }),
  genid(req) {
    if (req.query && req.query.ticket) {
      return `cas_session:::${req.query.ticket}`
    } else {
      return uid(24)
    }
  }
}

export const createDevServer = (app) => {
  const webpackConfig = require('../../webpack.config.js')
  const compiler = webpack(webpackConfig)
  app.use(WebpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    quiet: false,
    noInfo: true,
    stats: {
      assets: true,
      colors: true,
      version: true,
      hash: true,
      timings: true,
      chunk: false
    }
  }))
  app.use(WebpackHotMiddleware(compiler))
  return app
}

const productionErrorHandler = (err, req, res, next) => {
  res.status(500).send('<p>Internal Server Error</p>')
  console.error(err.stack) // eslint-disable-line no-console
  next(err)
}

export const createServer = (app) => {
  if (!PRODUCTION) {
    app = createDevServer(app)
  }
  app.use(session(sessionConfig))
  app.use(helmet())
  app.use(express.static(path.resolve(__dirname, '../../public')))

  // mount routes
  app.use('/pgt', routes.pgt)
  app.use('/auth', routes.auth)
  app.use('/', routes.app)

  // error handler
  app.use(PRODUCTION ? productionErrorHandler : devErrorHandler)
  return app
}
