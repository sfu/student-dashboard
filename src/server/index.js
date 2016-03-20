/* eslint no-console: 0 */

import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import {
  loggedin,
  authenticateUser,
  handleSingleSignout
} from './auth-middleware'

const store = new session.MemoryStore()
const app = express()
app.use(session({
  secret: 'wharrrgarbl',
  resave: false,
  saveUninitialized: false,
  store
}))

app.get('/auth', authenticateUser)

app.post('/auth', [bodyParser.urlencoded({extended:false}), handleSingleSignout(store)])

app.get('*', loggedin, (req, res) => {
  res.send(`<a href="https://cas.sfu.ca/cas/logout">Logout</a>`)
})

app.listen(3000, () => {
  console.info('server listening on 3000')
})
