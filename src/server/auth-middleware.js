import cas from './cas-client'

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
