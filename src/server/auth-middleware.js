import CAS from 'cas'

const casConfig = {
  base_url: process.env.CAS_BASE_URL,
  service: process.env.CAS_SERVICE,
  version: 2.0
}

if (process.env.CAS_SSO_SERVERS) {
  casConfig.sso_servers = process.env.CAS_SSO_SERVERS.split(',')
}

const cas = new CAS(casConfig)

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
        res.send(500)
        return
      }
      req.session.auth = {status, username, extended}
      const redirectUrl = req.session.redirectAfterLogin || '/'
      delete req.session.redirectAfterLogin
      res.redirect(redirectUrl)
    })
  }
}

export function handleSingleSignout(req, res, next) {
  cas.handleSingleSignout(req, res, next, (ticket) => {
    // find the session containing the ticket
    req.sessionStore.all((err, sessions) => {
      Object.keys(sessions).forEach((sid) => {
        if (sessions[sid].auth.extended.ticket === ticket) {
          req.sessionStore.destroy(sid, () => {})
        }
      })
    })
  })
}
