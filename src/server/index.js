/* eslint no-console: 0 */
import {createServer} from './server'
import express from 'express'

const app = express()
app.set('trust proxy', 1)

createServer(app).listen(process.env.EXPRESS_PORT, () => {
  console.info(`HTTP server listening on port ${process.env.EXPRESS_PORT}`)
})
