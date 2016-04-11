/* eslint no-console: 0 */

import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import fs from 'fs'
import axios from 'axios'
import * as oauth from './oauth'
import http from 'http'
import https from 'https'
import helmet from 'helmet'
import cas from './cas-client'
import {sync as uid} from 'uid-safe'
import redis from 'redis'
import ConnectRedis from 'connect-redis'
import {
  loggedin,
  authenticateUser,
  handleSingleSignout
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

app.all('/pgt/:pgtcall?', async (req, res) => {
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

app.get('/auth', authenticateUser)

app.post('/auth', [bodyParser.urlencoded({extended:false}), handleSingleSignout])

app.get('/', loggedin, (req, res) => {
  // get a cas proxy ticket, and then just print it out
  let oAuthCreds
  cas.getProxyTicket(req.session.auth.extended.PGTIOU, process.env.PORTAL_SERVICE_NAME, (err, pt) => {
    if (err) {
      // if the user's PGT is invalid, destroy the session and redirct to /auth
      if (err.message.includes('INVALID_TICKET')) {
        req.session.destroy(() => {
          res.redirect('/auth')
        })
      // otherwise, give up
      } else {
        res.status(500).send(err)
      }
    } else {
      // now let's get an oAuth token
      oauth.getAccessToken(pt).then((response) => {
        // let's get the user's bio data from the REST server
        oAuthCreds = response.data
        axios({
          method: 'get',
          url: `https://api.its.sfu.ca/aobrest/v1/datastore2/global/userBio.js?username=${req.session.auth.username}`,
          headers: {
            'Authorization': `Bearer ${response.data.access_token}`
          }
        }).then((response) => {
          const bio = response.data
          res.send(`
<html><head></head><body><h1>Hello, ${bio.firstnames} ${bio.lastname}</h1>
<h2>User Bio Data</h2>
<p>This information was retreived from AOBRestServer via an oAuth-protected service on the API Portal</p>
<pre>https://api.its.sfu.ca/aobrest/v1/datastore2/global/userBio.js?username=${req.session.auth.username}</pre>
<pre>${JSON.stringify(oAuthCreds, null, 2)}</pre>
<pre>${JSON.stringify(bio, null, 2)}</pre>
<h2>User Session</h2>
<pre>${JSON.stringify(req.session, null, 2)}</pre>
</body></html>
            `)
        }).catch((response) => {
          console.log(response)
          res.status(500).send(response)
        })
      }).catch((response) => {
        console.log(response)
        res.status(500).send(response)
      })
    }
  })
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
