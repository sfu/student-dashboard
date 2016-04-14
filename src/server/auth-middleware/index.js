import cas from '../cas-client'

export function loggedin(req, res, next) {
  if (req.session.auth && req.session.auth.status) {
    next()
  } else {
    req.session.redirectAfterLogin = req.originalUrl
    res.redirect('/auth')
  }
}

export function authenticateUser(req, res, next) {
  // user is logged in, goto next
  if (req.session.auth && req.session.auth.status) {
    next()
  } else {
    // authenticate with CAS
    cas.authenticate(req, res, (err, status, username, extended) => {
      if (err) {
        res.status(500).send(err)
        return
      }
      const redirectUrl = req.session.redirectAfterLogin || '/'
      delete req.session.redirectAfterLogin
      req.session.regenerate(() => {
        req.session.auth = {status, username, extended}
        res.redirect(redirectUrl)
      })
    }, process.env.CAS_SERVICE)
  }
}

export function handleSingleSignout(req, res, next) {
  cas.handleSingleSignout(req, res, next, (ticket) => {
    // CAS sessions have the form `cas_session:::{SERVICE_TICKET}`
    const sid = `cas_session:::${ticket}`
    req.sessionStore.destroy(sid, () => {})
  })
}

async function getUser(req, res, next) {
  try {
    req.USER_RECORD = await User.findByUsername(req.session.auth.username)
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
      await req.USER_RECORD.set({access_token, refresh_token}).save()
      req.session.user = req.USER_RECORD
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
        req.USER_RECORD = await User.forge({
          username,
          lastname,
          firstnames,
          commonname,
          barcode,
          access_token,
          refresh_token
        }).save()
        req.session.user = req.USER_RECORD
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
