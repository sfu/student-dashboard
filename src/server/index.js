/* eslint no-console: 0 */

import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import {
  loggedin,
  authenticateUser,
  handleSingleSignout
} from './auth-middleware'
const RedisStore = require('connect-redis')(session)

const app = express()

let sessionConfig = {
  secret: process.env.SESSION_SECRET,
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

app.listen(process.env.EXPRESS_PORT, () => {
  console.info(`server listening on ${process.env.EXPRESS_PORT}`)
})
