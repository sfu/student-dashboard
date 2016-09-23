import path from 'path'
import {Router} from 'express'
import {loggedin} from '../auth-middleware'
import bodyParser from 'body-parser'
import {oAuthenticatedRequest} from '../lib'

const router = Router()

router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/graphql_docs.html'))
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
    if (graphqlErr.message === 'ERR_CREDENTIALS_INVALID') {
      return res.boom.unauthorized('ERR_CREDENTIALS_INVALID')
    }
    res.boom.badImplementation(graphqlErr.message)
  })
})

router.get('/graphiql', loggedin, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/graphiql.html'))
})

export default router
