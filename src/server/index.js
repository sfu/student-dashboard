/* eslint no-console: 0 */

import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import fs from 'fs'
import http from 'http'
import https from 'https'
import {
  loggedin,
  authenticateUser,
  handleSingleSignout
} from './auth-middleware'
const RedisStore = require('connect-redis')(session)

const app = express()

let sessionConfig = {
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_COOKIE_NAME || 'connect.sid',
  cookie: {},
  resave: false,
  saveUninitialized: false
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
  sessionConfig.cookie.secure = true
  sessionConfig.store = new RedisStore({
    url: process.env.REDIS_URL
  })
}
app.use(session(sessionConfig))

app.get('/auth', authenticateUser)

app.post('/auth', [bodyParser.urlencoded({extended:false}), handleSingleSignout])

app.get('*', loggedin, (req, res) => {
  res.send(`<a href="https://cas.sfu.ca/cas/logout">Logout</a>`)
})

if (process.env.EXPRESS_HTTPS) {
  if (process.env.HTTPS_CERT_FILE && process.env.HTTPS_KEY_FILE) {
    https.createServer({
      cert:fs.readFileSync(process.env.HTTPS_CERT_FILE),
      key: fs.readFileSync(process.env.HTTPS_KEY_FILE)
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
