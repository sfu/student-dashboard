import cas from '../cas-client'
import {getAccessToken} from '../oauth'
import db from '../db'
import axios from 'axios'
import uuid from 'node-uuid'

function loggedin(req, res, next) {
  if (req.session.auth && req.session.auth.status) {
    next()
  } else {
    req.session.redirectAfterLogin = req.originalUrl
    res.redirect('/auth')
  }
}

function authenticateUser(req, res, next) {
  // user is logged in, goto next
  if (req.session.auth && req.session.auth.status) {
    next()
  } else {
    // authenticate with CAS
    cas.authenticate(req, res, (err, status, username, extended) => {
      if (err) {
        next(err)
      } else {
        const redirectUrl = req.session.redirectAfterLogin || '/'
        delete req.session.redirectAfterLogin
        req.session.regenerate(() => {
          req.session.auth = {status, username, extended}
          req.REDIRECT_AFTER_LOGIN = redirectUrl
          next()
        })
      }
    }, process.env.CAS_SERVICE)
  }
}

function handleSingleSignout(req, res, next) {
  cas.handleSingleSignout(req, res, next, (ticket) => {
    // CAS sessions have the form `cas_session:::{SERVICE_TICKET}`
    const sid = `cas_session:::${ticket}`
    req.sessionStore.destroy(sid, () => {})
  })
}

async function getUser(req, res, next) {
  const {username} = req.session.auth
  try {
    const result = await db('users').where({username}).limit(1)
    req.USER_RECORD = result.length ? result[0] : null
    next()
  } catch(e) {
    next(e)
  }
}

async function getUserBio(username, token) {
  try {
    const bio = await axios({
      method: 'get',
      url: `https://api.its.sfu.ca/aobrest/v1/datastore2/global/userBio.js?username=${username}`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return bio.data
  } catch (e) {
    throw new Error(e.data)
  }
}

async function provisionOrUpdateUser(req, res, next) {
  if (req.USER_RECORD) {
    try {
      const {access_token, refresh_token} = req.OAUTH_CREDENTIALS
      const {username} = req.USER_RECORD
      const user = await db('users').where({username}).update({access_token, refresh_token}).returning('*')
      req.session.user = user ? user[0] : null
      next()
    } catch(e) {
      next(e)
    }
  } else {
    try {
      const {access_token, refresh_token} = req.OAUTH_CREDENTIALS
      const bio = await getUserBio(req.session.auth.username, access_token)
      const {username, lastname, firstnames, commonname, barcode} = bio
      try {
        const user =await db('users').insert({
          username,
          lastname,
          firstnames,
          commonname,
          barcode,
          uid: uuid.v4(),
          access_token,
          refresh_token
        }).returning('*')
        req.session.user = user ? user[0] : null
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
  authenticateUser,
  handleSingleSignout,
  getUser,
  provisionOrUpdateUser,
  getProxyTicket,
  getOauthCredentials
}
