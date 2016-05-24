/* eslint no-console: 0 */
import express from 'express'
import session from 'express-session'
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

app.set('trust proxy', 1)
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

app.listen(process.env.EXPRESS_PORT, () => {
  console.info(`HTTP server listening on port ${process.env.EXPRESS_PORT}`)
})
