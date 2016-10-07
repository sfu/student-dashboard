import {Router} from 'express'
import {loggedin} from '../auth-middleware'
import bodyParser from 'body-parser'
import {oAuthenticatedRequest} from '../lib'

const debug = require('debug')('snap:server:routes:graphql')

const router = Router()

router.get('/', loggedin, (req, res) => {
  res.sendFile(`${req.app.get('htmlDirectory')}/graphiql.html`)
})

router.post('/', loggedin, bodyParser.json(), async (req, res) => {
  const {method} = req
  const payload = method === 'POST' ? req.body : {
    query: req.query.query || null,
    variables: req.query.variables || null,
    operationName: req.query.operationName || null
  }


  oAuthenticatedRequest(req, res, {
    method: 'post',
    url: process.env.GRAPHQL_SERVER,
    data: payload,
  }).then(response => {
    res.send(response.data)
  }).catch(graphqlErr => {
    debug('Caught GraphQL error: %s', graphqlErr.message)
    if (graphqlErr.message === 'ERR_CREDENTIALS_INVALID') {
      return res.boom.unauthorized('ERR_CREDENTIALS_INVALID')
    }
    res.boom.badImplementation(graphqlErr.message)
  })
})

router.get('/graphiql', (req, res) => {
  res.redirect('/graphql')
})

router.get('/docs', (req, res) => {
  res.sendFile(`${req.app.get('htmlDirectory')}/graphql_docs.html`)
})

export default router
