/* eslint no-console: 0 */
import {createServer} from './server'

const app = createServer()
app.listen(process.env.EXPRESS_PORT, () => {
  console.info(`HTTP server listening on port ${process.env.EXPRESS_PORT}`)
})
