/* eslint no-console: 0 */

import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import fs from 'fs'
import axios from 'axios'
import qs from 'qs'
import http from 'http'
import https from 'https'
import helmet from 'helmet'
import cas from './cas-client'
import {sync as uid} from 'uid-safe'
import ConnectRedis from 'connect-redis'
import {
  loggedin,
  authenticateUser,
  handleSingleSignout
} from './auth-middleware'

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

if (process.env.NODE_ENV === 'production') {
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


app.get('/auth', authenticateUser)

app.post('/auth', [bodyParser.urlencoded({extended:false}), handleSingleSignout])

app.get('*', loggedin, (req, res) => {
  res.send(`<a href="https://cas.sfu.ca/cas/logout">Logout</a>`)
})

if (process.env.EXPRESS_HTTPS) {
  if (process.env.HTTPS_CERT_FILE && process.env.HTTPS_KEY_FILE) {
    https.createServer({
      cert:fs.readFileSync(process.env.HTTPS_CERT_FILE),
      key: fs.readFileSync(process.env.HTTPS_KEY_FILE),
      ca: [
        fs.readFileSync(process.env.HTTPS_INTERMEDIATE_CERT_FILE),
        fs.readFileSync(process.env.HTTPS_ROOT_CERT_FILE),
        fs.readFileSync(process.env.HTTPS_THWATE_ROOT_CERT_FILE)
      ]
    }, app).listen(process.env.EXPRESS_PORT, () => {
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
