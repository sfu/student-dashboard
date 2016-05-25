import express from 'express'
import session from 'express-session'
import {sync as uid} from 'uid-safe'
import helmet from 'helmet'
import path from 'path'
import * as routes from './routes'
import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
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

export const createDevServer = () => {
  const webpackConfig = require('../../webpack.config.js')
  const compiler = webpack(webpackConfig)
  const app = new WebpackDevServer(compiler, {

    // webpack-dev-middleware options.
    publicPath: webpackConfig.output.publicPath,
    // publicPath: `https://icat-graham.its.sfu.ca${webpackConfig.output.publicPath}`,
    hot: true,
    quiet: false,
    noInfo: false,
    stats: {
      assets: true,
      colors: true,
      version: true,
      hash: true,
      timings: true,
      chunk: false
    },

    // webpack-dev-server options
    filename: "bundle.js",
    contentBase: false,
    setup(app) {
      app.set('trust proxy', 1)
    }
  })
  return app
}

export const createProductionServer = () => {
  const app = express()
  app.set('trust proxy', 1)
  return app
}


const productionErrorHandler = (err, req, res, next) => {
  res.status(500).send('<p>Internal Server Error</p>')
  console.error(err.stack) // eslint-disable-line no-console
  next(err)
}

export const createServer = () => {
  const app = PRODUCTION ? createProductionServer() : createDevServer()
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
