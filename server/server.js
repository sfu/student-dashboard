import express from 'express'
import session from 'express-session'
import uuid from 'node-uuid'
import helmet from 'helmet'
import path from 'path'
import fs from 'fs'
import * as routes from './routes'
import webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import devErrorHandler from 'errorhandler'
import ConnectRedis from 'connect-redis'
import boom from 'express-boom'
import enforceSSL from 'express-enforces-ssl'

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
      return uuid.v4()
    }
  }
}

export const createDevServer = (app) => {
  const webpackConfig = require('../webpack.config.js')()
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
  if (req.isApiRequest || req.headers.accept === 'application/json') {
    res.boom.badImplementation()
  } else {
    res.status(500).send('<p>Internal Server Error</p>')
  }
  console.error(err.stack) // eslint-disable-line no-console
  next(err)
}

export const createServer = (app) => {
  if (!PRODUCTION) {
    app = createDevServer(app)
  }
  app.set('JWT_SIGNING_CERTIFICATE', fs.readFileSync(process.env.JWT_SIGNING_CERTIFICATE))
  app.set('JWT_SIGNING_ALG', 'RS512')
  app.use(session(sessionConfig))
  app.use(helmet())
  app.use(express.static(path.resolve(__dirname, '../public')))
  app.use(boom())

  if (PRODUCTION) {
    app.use(enforceSSL())
  }

  // mount routes
  app.use('/pgt', routes.pgt)
  app.use('/auth', routes.auth)
  app.use('/api', routes.api)
  app.use('/graphql', routes.graphql)
  app.use('/isup', (req, res) => { res.send('ok') })
  app.use('*', routes.app)

  // error handler
  app.use(PRODUCTION ? productionErrorHandler : devErrorHandler())
  return app
}
