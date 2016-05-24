/* eslint no-console: 0 */
import express from 'express'
import session from 'express-session'
import fs from 'fs'
import http from 'http'
import https from 'https'
import helmet from 'helmet'
import path from 'path'
import {sync as uid} from 'uid-safe'
import ConnectRedis from 'connect-redis'
import * as routes from './routes'

const RedisStore = ConnectRedis(session)
const app = express()

let sessionConfig = {
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_COOKIE_NAME || 'connect.sid',
  cookie: {},
  resave: false,
  saveUninitialized: false,
  genid(req) {
    if (req.query && req.query.ticket) {
      return `cas_session:::${req.query.ticket}`
    } else {
      return uid(24)
    }
  }
}

// assume that if we're not serving HTTPS, we're behind a proxy
if (!process.env.EXPRESS_HTTPS) {
  app.set('trust proxy', 1)
  sessionConfig.cookie.secure = true
}

if (process.env.SESSION_STORE_REDIS_URL) {
  sessionConfig.store = new RedisStore({
    url: process.env.SESSION_STORE_REDIS_URL
  })
}

app.use(session(sessionConfig))
app.use(helmet())
app.use(express.static(path.resolve(__dirname, '../../public')))

// mount routes
app.use('/pgt', routes.pgt)
app.use('/auth', routes.auth)
app.use('/', routes.app)

app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
  console.error(err.stack)
  res.status(500).send(err)
})

if (process.env.EXPRESS_HTTPS) {
  if (process.env.HTTPS_CERT_FILE && process.env.HTTPS_KEY_FILE) {
    let httpsOptions = {
      cert: fs.readFileSync(process.env.HTTPS_CERT_FILE),
      key: fs.readFileSync(process.env.HTTPS_KEY_FILE)
    }
    if (process.env.HTTPS_CA_BUNDLE) {
      httpsOptions.ca = process.env.HTTPS_CA_BUNDLE.split(',').map(cert => fs.readFileSync(cert))
    }
    https.createServer(httpsOptions, app).listen(process.env.EXPRESS_PORT, () => {
      console.info(`HTTPS server listening on port ${process.env.EXPRESS_PORT}`)
    })
  } else {
    throw 'EXPRESS_HTTPS was specified in your .env, but no HTTPS_CERT_FILE and/or HTTPS_KEY_FILE was specified.'
  }
} else {
  http.createServer(app).listen(process.env.EXPRESS_PORT, () => {
    console.info(`HTTP server listening on port ${process.env.EXPRESS_PORT}`)
  })
}
