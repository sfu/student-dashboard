import cas from '../cas-client'
import {getAccessToken} from '../oauth'
import db from '../db'
import uuid from 'node-uuid'
import {
  verifyJwt,
  loadUser,
  getUserBio
} from '../lib/'

// Determine if a user is logged in
// If the user has a valid session, then they're logged in
// If the request is an API request, and a Bearer token is present, then they're logged in
// If they're not logged in, then they get a JSON 401 or redirected to CAS, as appropriate
async function loggedin(req, res, next) {

  // session
  if (req.session.auth && req.session.auth.status) {
    return next()
  }

  // api request
  if (req.isApiRequest) {
    let token = req.headers.authorization
    token = token ? token.split(' ') : undefined

    if (!token || (token && token[0].toLowerCase() !== 'bearer')) {
      return res.redirectToLogin()
    }

    try {
      const payload = await verifyJwt(token[1], req.app.get('JWT_SIGNING_CERTIFICATE'))
      req.username = payload.sub
      return next()
    } catch(e) {
      return next(e)
    }
  }
  res.redirectToLogin()
}

function authenticateCasUser(req, res, next) {

  cas.authenticate(req, res, (err, status, username, extended) => {
    if (err) {
      next(err)
    } else {
      const redirectUrl = req.session.redirectTo || '/'
      delete req.session.redirectTo
      req.session.regenerate(() => {
        req.session.auth = {status, username, extended}
        req.username = username
        req.session.redirectTo = redirectUrl
        next()
      })
    }
  }, process.env.CAS_SERVICE)
}

function handleSingleSignout(req, res, next) {
  cas.handleSingleSignout(req, res, next, (ticket) => {
    // CAS sessions have the form `cas_session:::{SERVICE_TICKET}`
    const sid = `cas_session:::${ticket}`
    req.sessionStore.destroy(sid, () => {})
  })
}

async function getUser(req, res, next) {
  const username = req.username
  try {
    req.user = await loadUser(username)
    next()
  } catch(e) {
    next(e)
  }
}

async function provisionOrUpdateUser(req, res, next) {
  if (req.user && req.isApiRequest) {
    next()
  } else if (req.user && !req.isApiRequest) {
    next()
  } else {
    try {
      let access_token, refresh_token
      if (req.OAUTH_CREDENTIALS) {
        access_token = req.OAUTH_CREDENTIALS.access_token
        refresh_token = req.OAUTH_CREDENTIALS.refresh_token
      }

      const bio = await getUserBio(req.username, access_token, req)
      const {username, lastname, firstnames, commonname, barcode} = bio
      try {
        const payload = {
          username,
          lastname,
          firstnames,
          commonname,
          barcode,
          uid: uuid.v4()
        }

        if (!req.isApiRequest) {
          payload.access_token = access_token
          payload.refresh_token = refresh_token
        }

        const user = await db('users').insert(payload).returning('*')
        req.user = user ? user[0] : null
        next()
      } catch(e) {
        next(e)
      }
    } catch (e) {
      next(e)
    }
  }
}

async function getProxyTicket(req, res, next) {
  try {
     req.PROXY_TICKET = await cas.getProxyTicketAsync(req.session.auth.extended.PGTIOU, process.env.PORTAL_SERVICE_NAME)
     next()
  } catch (e) {
    next(e)
  }
}

async function getOauthCredentials(req, res, next) {
  try {
    const response = await getAccessToken(req.PROXY_TICKET)
    req.OAUTH_CREDENTIALS = response.data
    next()
  } catch (e) {
    next(e)
  }
}

export {
  loggedin,
  authenticateCasUser,
  handleSingleSignout,
  getUser,
  provisionOrUpdateUser,
  getProxyTicket,
  getOauthCredentials
}
