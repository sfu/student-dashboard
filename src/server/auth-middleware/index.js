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
