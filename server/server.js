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
import proxy from 'express-http-proxy'
import requestId from 'express-request-id'

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
  app.set('compiler', compiler)
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
  app.set('JWT_SIGNING_KEY', fs.readFileSync(process.env.JWT_SIGNING_KEY))
  app.set('JWT_SIGNING_ALG', 'RS512')
  app.use(session(sessionConfig))
  app.use(helmet())
  app.use(requestId())
  app.use(express.static(path.resolve(__dirname, '../public')))
  app.use(boom())

  app.set('htmlDirectory', path.resolve(__dirname, '../public/assets'))

  // mount routes
  app.use('/pgt', routes.pgt)
  app.use('/auth', routes.auth)
  app.use('/api', routes.api)
  app.use('/graphql', routes.graphql)
  app.use('/translink', proxy('api.translink.ca', {
    https: false,
    preserveHostHdr: true,
    forwardPath: (req) => `/RTTIAPI/V1${req.url}`,
    decorateRequest: (proxyReq) => {
      // set headers
      proxyReq.headers['accept'] = 'application/json'

      // inject API Key into query string
      const path = require('url').parse(proxyReq.path)
      const qs = path.query ? path.query.split('&') : []
      qs.push(`apikey=${process.env.TRANSLINK_API_KEY}`)
      path.query = qs.join('&')
      path.search = `?${path.query}`
      proxyReq.path = path.format()

      return proxyReq
    }
  }))
  app.use('/isup', (req, res) => { res.send('ok') })
  app.use('*', routes.app)

  // error handler
  app.use(PRODUCTION ? productionErrorHandler : devErrorHandler())
  return app
}
