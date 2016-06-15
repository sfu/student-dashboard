import express from 'express'

// add methods to the Express `response` object
export function extendResponse() {

  // redirect user to login page OR send a 401 as JSON, as appropriate
  express.response.redirectToLogin =
    express.response.redirectToLogin ||
    function(message = 'user authentication required') {
      if (this.req.isApiRequest) {
        this.boom.unauthorized(message)
      } else {
        this.req.session.redirectAfterLogin = this.req.originalUrl
        this.redirect('/auth/login/cas')
      }
    }
}

// add methods to the Express `response` object
export function extendRequest() {}

// convenience method to extend both response and request in one fell swoop
export function extendExpress() {
  extendRequest()
  extendResponse()
}
