const debug = require('debug')('snap:server:authMiddleware')
import cas from '../cas-client'
import { getAccessToken, validateAccessToken } from '../oauth'
import db from '../db'
import uuid from 'node-uuid'
import {
  verifyJwt,
  loadUser,
  getUserBio,
  updateOAuthCredentialsForUser
} from '../lib/'

// Determine if a user is logged in
// If the user has a valid session, then they're logged in
// If the request is an API request, and a Bearer token is present, then they're logged in
// If they're not logged in, then they get a JSON 401 or redirected to CAS, as appropriate
async function loggedin(req, res, next) {

  // session
  if (req.session.auth) {
    debug('`loggedin` called, user has session, calling `next()`')
    return next()
  }

  // api request
  if (req.isApiRequest) {
    let token = req.headers.authorization
    token = token ? token.split(' ') : undefined
    debug('Incoming api request')
    if (!token || (token && token[0].toLowerCase() !== 'bearer')) {
      debug('Invalid or missing token, redirecting to login')
      return res.redirectToLogin()
    }

    try {
      debug('Validating JWT')
      const payload = await verifyJwt(token[1], req.app.get('JWT_SIGNING_CERTIFICATE'))
      req.username = payload.sub
      debug('JWT sub: %s', req.username)
      return next()
    } catch(e) {
      debug('JWT error: %s', e)
      return next(e)
    }
  }

  debug('User not logged in, redirecting to login')
  res.redirectToLogin()
}

function authenticateCasUser(req, res, next) {
    cas.authenticate(req, res, (err, status, username, extended) => {
        if (err) {
      debug('Error authenticating user with CAS')
      debug(err)
      next(err)
    } else {
      debug(`Authenticated user %s via CAS`, username)
      const {redirectTo} = req.session || '/'
      delete req.session.redirectTo
      req.session.regenerate(() => {
        req.session.createdAt = new Date().toLocaleString()
        req.session.auth = status
        req.session.username = req.username = username
        req.session.casAttributes = extended
        req.session.redirectTo = redirectTo

        debug(`Regenerating session: ${JSON.stringify(req.session, null, 2)}`)
        next()
      })
    }
  }, process.env.CAS_SERVICE)
}

async function getUser(req, res, next) {
    const { username } = req
  debug('Getting user record for %s', username)

  try {
    req.user = await loadUser(username)
    debug(req.user ? `Retreived user record for ${username}: ${JSON.stringify(req.user, null, 2)}` : `No user record exists for ${username}`)
    if (req.session) {
      req.session.user = req.user
    }
    next()
  } catch(e) {
    debug('Error getting user from DB: %s', e)
    next(e)
  }
}

async function getProxyTicket(req, res, next) {
  debug('Getting proxy ticket for %s', req.username)
  try {
     req.PROXY_TICKET = await cas.getProxyTicketAsync(req.session.casAttributes.PGTIOU, process.env.PORTAL_SERVICE_NAME)
     debug('Proxy ticket: %s', req.PROXY_TICKET)
     next()
  } catch (e) {
    debug('Error getting proxy ticket: %s', e)
    next(e)
  }
}

async function provisionOrUpdateUser(req, res, next) {
    debug('provisionOrUpdateUser')

  if (req.user || req.session.user) {
    if (req.isApiRequest) {
      return next()
    }

    const user = req.user || req.session.user
    const userHasAccessToken = !!user.oauth_access_token
    const accessTokenStillValid = userHasAccessToken ? await validateAccessToken(user.oauth_access_token, new Date(user.oauth_valid_until).getTime()) : false
    debug('User %s exists in DB, access token valid? %s', user.username, accessTokenStillValid)

    // user exists in the database, may or may not need new oauth credentials
    if (accessTokenStillValid) {
      return next()
    } else {
      try {
        debug('Getting new OAuth credentials for %s', user.username)
        const response = await getAccessToken(req.PROXY_TICKET)
        debug(JSON.stringify(response.data))
        const { access_token, refresh_token, valid_until } = response.data
        debug('Updating user record in DB with new OAuth credentials')
        req.user = req.session.user = await updateOAuthCredentialsForUser(user.username, {access_token, refresh_token, valid_until})
        debug(JSON.stringify(req.user))
        return next()
      } catch(e) {
        debug('Error getting new OAuth credentials: %s', e)
        return next(e)
      }
    }
  }

  // user does not exist in the database
  // fetch credentials for the user and create their db record
  try {
    debug('User %s does not exist in DB, fetching OAuth credentials and creating record', req.username)
    // to get the bio we need to get oauth credentials fisrt
    // however, the mobile apps can also call an api route to get the user record with a JWT as the auth
    // in those cases, we can't get oauth credentials; getUserBio needs to be called with undef for the token

    let bio
    let oauthCredentials = {}
    if (req.isApiRequest) {
      debug('This is an API request, getting bio')
      bio = await getUserBio(req.username, null, req)
      debug(JSON.stringify(bio, null, 2))
    } else {
      debug('Not an API request; getting OAuth credentials and bio')
      const oauthResponse = await getAccessToken(req.PROXY_TICKET)
      oauthCredentials = oauthResponse.data
      debug(JSON.stringify(oauthCredentials))
      bio = await getUserBio(req.username, oauthCredentials.access_token, req)
      debug(JSON.stringify(bio, null, 2))
    }

    const { username, lastname, firstnames, commonname, barcode } = bio
    const { access_token, refresh_token, valid_until } = oauthCredentials

    const payload = {
      username,
      lastname,
      firstnames,
      commonname,
      barcode,
      uid: uuid.v4(),
      oauth_access_token: access_token || null,
      oauth_refresh_token: refresh_token || null,
      oauth_valid_until: valid_until ? new Date(valid_until) : null
    }
    debug('Attempting to create user record in DB')
    const user = await db('users').insert(payload).returning('*')
    req.user = req.session.user = user ? user[0] : null
    debug(JSON.stringify(req.user, null, 2))
    next()
  } catch (e) {
    debug('Error provisioning user: %s', e)
    next(e)
  }

}

function handleSingleSignout(req, res, next) {
  cas.handleSingleSignout(req, res, next, (ticket) => {
    // CAS sessions have the form `cas_session:::{SERVICE_TICKET}`
    const sid = `cas_session:::${ticket}`
    req.sessionStore.destroy(sid, () => {})
  })
}


export {
  loggedin,
  authenticateCasUser,
  handleSingleSignout,
  getUser,
  provisionOrUpdateUser,
  getProxyTicket,
  // getOauthCredentials
}
