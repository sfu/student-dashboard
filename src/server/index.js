/* eslint no-console: 0 */

import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import fs from 'fs'
import http from 'http'
import https from 'https'
import helmet from 'helmet'
import {sync as uid} from 'uid-safe'
import redis from 'redis'
import ConnectRedis from 'connect-redis'
import {
  loggedin,
  authenticateUser,
  handleSingleSignout,
  getUser,
  getProxyTicket,
  getOauthCredentials,
  provisionOrUpdateUser
} from './auth-middleware'

import {RedisStore as PGTStore} from './pgt-store'
const pgtStore = new PGTStore(redis.createClient({
  url: process.env.CAS_PGT_REDIS_URL
}))

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

app.get('/pgt/:pgtcall?', async (req, res) => {
  const {pgtIou, pgtId, pgtiou} = req.query
  // request is from a CAS client asking for a PGT
  if (req.params.pgtcall === 'getPGT') {
    const pgt = await pgtStore.get(pgtiou)
    if (pgt) {
      res.set('Content-Type', 'text/plain').status(200).send(pgt)
    } else {
      res.set('Content-Type', 'text/plain').status(403).send('Invalid PGTIOU supplied')
    }

  // request is from the CAS server providing a PGTIOU/PGT
  } else {
    res.status(200).send('ok')
    if (pgtIou && pgtId) {
      await pgtStore.set(pgtIou, pgtId)
    }
  }
})

app.get('/auth',
  authenticateUser,
  getUser,
  getProxyTicket,
  getOauthCredentials,
  provisionOrUpdateUser,
  (req, res) => {
    res.redirect(req.REDIRECT_AFTER_LOGIN)
  }
)

app.post('/auth', [bodyParser.urlencoded({extended:false}), handleSingleSignout])

app.get('/', loggedin, (req, res) => {
  res.status(200).send('OK')
})


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
