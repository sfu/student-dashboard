/* eslint no-console: 0 */
import {createServer} from './server'
import express from 'express'
import assert from 'assert'
import {extendExpress} from './extendExpress'

extendExpress()

if (process.env.NODE_ENV === 'production') {
  assert(process.env.JWT_MODE !== 'decode', `Don't use JWT_MODE=decode in production!`)
}

const app = express()
app.set('trust proxy', 1)

createServer(app).listen(process.env.EXPRESS_PORT, () => {
  console.info(`HTTP server listening on port ${process.env.EXPRESS_PORT}`)
})
