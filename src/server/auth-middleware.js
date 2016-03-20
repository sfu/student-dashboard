import CAS from 'cas'

const cas = new CAS({
  base_url: 'https://cas.sfu.ca/cas',
  service: 'http://home.grahamballantyne.com:3000/auth',
  version: 2.0,
  sso_servers: ['142.58.101.11', '::ffff:142.58.101.11']
})

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

export function handleSingleSignout(sessionStore) {
  return function(req, res, next) {
    cas.handleSingleSignout(req, res, next, (ticket) => {
      // find the session containing the ticket
      sessionStore.all((err, sessions) => {
        Object.keys(sessions).forEach((sid) => {
          if (sessions[sid].auth.extended.ticket === ticket) {
            sessionStore.destroy(sid, () => {})
          }
        })
      })
    })
  }
}
