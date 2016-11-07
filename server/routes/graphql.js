import { Router } from 'express'
import { loggedin } from '../auth-middleware'
import bodyParser from 'body-parser'
import { oAuthenticatedRequest, readHtmlFile } from '../lib'
import { sign } from 'jsonwebtoken'

const debug = require('debug')('snap:server:routes:graphql')

const router = Router()

router.get('/', loggedin, async (req, res, next) => {

  // generate a JWT for the user for the callback to the user profile API
  const jwtPayload = {
    scope: 'oob',
    ip: req.ip
  }
  const jwtIss = process.env.JWT_ISS || 'https://snap.sfu.ca'
  const jwtOpts = {
    algorithm: req.app.get('JWT_SIGNING_ALG'),
    issuer: jwtIss,
    subject: req.session.user.username,
    expiresIn: 60
  }

  const token = sign(jwtPayload, req.app.get('JWT_SIGNING_KEY'), jwtOpts)

  try {
    const html = await readHtmlFile('graphiql.html', req.app)
    res.cookie('graphiqljwt', token, {
      expires: new Date(Date.now() + 60000),
      secure: true,
    })
    res.set('content-type','text/html')
    res.send(html)
    res.end()
  } catch(e) {
    next(e)
  }
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

export default router
