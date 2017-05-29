const debug = require('debug')('snap:server:authMiddleware')
import cas from '../cas-client'
import { getAccessToken, validateAccessToken } from '../oauth'
import db from '../db'
import uuid from 'uuid'
import {
  verifyJwt,
  loadUser,
  getUserBio,
  updateOAuthCredentialsForUser
} from '../lib/'


// Determine if a user is logged in with a session
// If session exists, set req.loggedIn = true for downstream middleware
// Otherwise, set req.loggedIn = false for downstream middleware
function loggedInWithSession(req, res, next) {
  debug('%s - %s - `loggedInWithSession` called`', req.id, req.originalUrl)
  if (req.loggedIn) {
    req.username = req.session.username
    debug('%s - %s - `loggedInWithSession` - user already logged in', req.id, req.originalUrl)
    return next()
  }

  if (req.session.auth) {
    debug('%s - %s - `loggedInWithSession` - found session`', req.id, req.originalUrl)
    req.username = req.session.username
    req.loggedIn = true
  } else {
    debug('%s - %s - `loggedInWithSession` - no session found', req.id, req.originalUrl)
    req.loggedIn = false
  }
  next()
}

// Determine if a user is logged in with a valid JWT
// If so, set req.loggedIn = true for downstream middleware
// Otherwise, set req.loggedIn = false for downstream middleware
async function loggedInWithJwt(req, res, next) {
  debug('%s - %s - `loggedInWithJwt` called', req.id, req.originalUrl)

  if (req.loggedIn) {
    debug('%s - %s - `loggedInWithJwt` - user already logged in', req.id, req.originalUrl)
    return next()
  }

  let token = req.headers.authorization
  token = token ? token.split(' ') : undefined

  if (!token || (token && token[0].toLowerCase() !== 'bearer')) {
    debug('%s - %s - `loggedInWithJwt` - invalid or missing token', req.id, req.originalUrl)
    req.loggedIn = false
    next()
  } else {
    try {
      debug('%s - %s - validating JWT', req.id, req.originalUrl)
      debug(token[1])
      const payload = await verifyJwt(token[1], req.app.get('JWT_SIGNING_CERTIFICATE'))
      if (!payload) {
        debug('%s - %s - invalid JWT', req.id, req.originalUrl)
        req.loggedIn = false
      } else {
        debug('%s - %s - valid JWT', req.id, req.originalUrl)
        req.jwtPayload = payload
        req.username = payload.sub
        debug('%s - %s - JWT sub: %s', req.id, req.originalUrl, req.username)
        req.loggedIn = true
      }
      next()
    } catch(e) {
      req.loggedIn = false
      debug('%s - %s - JWT error: %s', req.id, req.originalUrl, e)
      next(e)
    }
  }
}

function redirectToLoginIfNecessary(req, res, next) {
  debug('%s - %s - `redirectToLoginIfNecessary` called', req.id, req.originalUrl)
  if (req.loggedIn) {
    debug('%s - %s - `redirectToLoginIfNecessary` - logged in', req.id, req.originalUrl)
    next()
  } else {
    debug('%s - %s - `redirectToLoginIfNecessary` - redirecting to login', req.id, req.originalUrl)
    res.redirectToLogin()
  }
}

// Determine if a user is logged in
// If the user has a valid session, then they're logged in
// If the request is an API request, and a Bearer token is present, then they're logged in
// If they're not logged in, then they get a JSON 401 or redirected to CAS, as appropriate
async function loggedin(req, res, next) {

  // api request
  if (req.isApiRequest) {
    let token = req.headers.authorization
    token = token ? token.split(' ') : undefined
    debug('%s - %s - Incoming api request', req.id, req.originalUrl)
    if (!token || (token && token[0].toLowerCase() !== 'bearer')) {
      debug('%s - %s - Invalid or missing token, redirecting to login', req.id, req.originalUrl)
      return res.redirectToLogin()
    }

    try {
      debug('%s - %s - Validating JWT', req.id, req.originalUrl)
      const payload = await verifyJwt(token[1], req.app.get('JWT_SIGNING_CERTIFICATE'))
      req.username = payload.sub
      debug('%s - %s - JWT sub: %s', req.id, req.originalUrl, req.username)
      return next()
    } catch(e) {
      debug('%s - %s - JWT error: %s', req.id, req.originalUrl, e)
      return next(e)
    }
  }

  // session
  if (req.session.auth) {
    debug('%s - %s - `loggedin` called, user has session, calling `next()`', req.id, req.originalUrl)
    return next()
  }

  debug('%s - %s - User not logged in, redirecting to login', req.id, req.originalUrl)
  res.redirectToLogin()
}

function authenticateCasUser(req, res, next) {
  cas.authenticate(req, res, (err, status, username, extended) => {
    username = username.trim()
    if (err) {
      debug('%s - %s - Error authenticating user with CAS: %s', req.id, req.originalUrl, err)
      next(err)
    } else {
      debug(`%s - %s - Authenticated user %s via CAS`, req.id, req.originalUrl, username)
      const {redirectTo} = req.session || '/'
      delete req.session.redirectTo
      req.session.regenerate(() => {
        req.session.createdAt = new Date().toLocaleString()
        req.session.auth = status
        req.session.username = req.username = username
        req.session.casAttributes = extended
        req.session.redirectTo = redirectTo

        debug(`%s - %s - Regenerating session: ${JSON.stringify(req.session, null, 2)}`, req.id, req.originalUrl)
        next()
      })
    }
  }, process.env.CAS_SERVICE)
}

async function getUser(req, res, next) {
  const { username } = req
  debug('%s - %s - Getting user record for %s', req.id, req.originalUrl, username)

  try {
    req.user = await loadUser(username, ['id', 'username', 'lastname', 'firstnames', 'commonname', 'uid', 'barcode'])
    debug(req.user ? `${req.id} - ${req.originalUrl} - Retreived user record for ${username}: ${JSON.stringify(req.user, null, 2)}` : `${req.id} - ${req.originalUrl} - No user record exists for ${username}`)
    if (req.session) {
      req.session.user = req.user
    }
    next()
  } catch(e) {
    debug('%s - %s - Error getting user from DB: %s', req.id, req.originalUrl, e)
    next(e)
  }
}

async function getProxyTicket(req, res, next) {
  debug('%s - %s - Getting proxy ticket for %s', req.id, req.originalUrl, req.username)
  try {
     req.PROXY_TICKET = await cas.getProxyTicketAsync(req.session.casAttributes.PGTIOU, process.env.PORTAL_SERVICE_NAME)
     debug('%s - %s - Proxy ticket: %s', req.id, req.originalUrl, req.PROXY_TICKET)
     next()
  } catch (e) {
    debug('%s - %s - Error getting proxy ticket: %s', req.id, req.originalUrl, e)
    next(e)
  }
}

async function provisionOrUpdateUser(req, res, next) {
    debug('%s - %s - provisionOrUpdateUser', req.id, req.originalUrl)

  if (req.user || req.session.user) {
    if (req.isApiRequest) {
      return next()
    }

    const user = req.user || req.session.user
    const userHasAccessToken = !!user.oauth_access_token
    const accessTokenStillValid = userHasAccessToken ? await validateAccessToken(user.oauth_access_token, new Date(user.oauth_valid_until).getTime()) : false
    debug('%s - %s - User %s exists in DB, access token valid? %s', req.id, req.originalUrl, user.username, accessTokenStillValid)

    // user exists in the database, may or may not need new oauth credentials
    if (accessTokenStillValid) {
      return next()
    } else {
      try {
        debug('%s - %s - Getting new OAuth credentials for %s', req.id, req.originalUrl, user.username)
        const response = await getAccessToken(req.PROXY_TICKET)
        debug(`${req.id} - ${JSON.stringify(response.data)}`)
        const { access_token, refresh_token, valid_until } = response.data
        debug('%s - %s - Updating user record in DB with new OAuth credentials', req.id, req.originalUrl)
        req.user = req.session.user = await updateOAuthCredentialsForUser(user.username, {access_token, refresh_token, valid_until})
        debug(`${req.id} - ${JSON.stringify(req.user)}`)
        return next()
      } catch(e) {
        debug('%s - %s - Error getting new OAuth credentials: %s', req.id, req.originalUrl, e)
        return next(e)
      }
    }
  }

  // user does not exist in the database
  // fetch credentials for the user and create their db record
  try {
    debug('%s - %s - User %s does not exist in DB, fetching OAuth credentials and creating record', req.id, req.originalUrl, req.username)
    // to get the bio we need to get oauth credentials fisrt
    // however, the mobile apps can also call an api route to get the user record with a JWT as the auth
    // in those cases, we can't get oauth credentials; getUserBio needs to be called with undef for the token

    let bio
    let oauthCredentials = {}
    if (req.isApiRequest) {
      debug('%s - %s - This is an API request, getting bio', req.id, req.originalUrl)
      bio = await getUserBio(req.username, null, req)
      debug(`${req.id} - ${JSON.stringify(bio, null, 2)}`)
    } else {
      debug('%s - %s - Not an API request; getting OAuth credentials and bio', req.id, req.originalUrl)
      const oauthResponse = await getAccessToken(req.PROXY_TICKET)
      oauthCredentials = oauthResponse.data
      debug(`${req.id} - ${JSON.stringify(oauthCredentials)}`)
      bio = await getUserBio(req.username, oauthCredentials.access_token, req)
      debug(`${req.id} - ${JSON.stringify(bio, null, 2)}`)
    }

    const { username, lastname, firstnames, commonname, barcode } = bio
    const { access_token, refresh_token, valid_until } = oauthCredentials

    debug('%s - %s - Attempting to create user record in DB', req.id, req.originalUrl)
    const user = await db.raw(
      `INSERT INTO "users" ("username", "lastname", "firstnames", "commonname", "barcode", "uid", "oauth_access_token", "oauth_refresh_token", "oauth_valid_until")
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (username) DO UPDATE SET updated_at = now()::timestamp RETURNING *`,
      [
        username,
        lastname,
        firstnames,
        commonname,
        barcode,
        uuid.v4(),
        access_token || null,
        refresh_token || null,
        valid_until ? new Date(valid_until) : null
      ]
    )
    req.user = req.session.user = user.rows ? user.rows[0] : null
    debug(`${req.id} - ${JSON.stringify(req.user, null, 2)}`)
    next()
  } catch (e) {
    debug('%s - %s - Error provisioning user: %s', req.id, req.originalUrl, e)
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
  loggedInWithSession,
  loggedInWithJwt,
  redirectToLoginIfNecessary,
  loggedin,
  authenticateCasUser,
  handleSingleSignout,
  getUser,
  provisionOrUpdateUser,
  getProxyTicket,
  // getOauthCredentials
}
