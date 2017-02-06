import { Router } from 'express'
import bodyParser from 'body-parser'
const debug = require('debug')('snap:server:routes:api/v1/csp')

const router = Router()
router.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}))

router.post('/report', (req, res) => {
  debug('CSP Violation', req.body['csp-report'])
  res.status(204).end()
})

export default router
