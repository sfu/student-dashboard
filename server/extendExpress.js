const express = require('express');

// add methods to the Express `response` object
function extendResponse() {
  // redirect user to login page OR send a 401 as JSON, as appropriate
  express.response.redirectToLogin =
    express.response.redirectToLogin ||
    function (message = 'user authentication required') {
      if (this.req.isApiRequest) {
        this.boom.unauthorized(message);
      } else {
        this.req.session.redirectTo = this.req.originalUrl;
        this.redirect('/auth/login/cas');
      }
    };
}

// add methods to the Express `response` object
function extendRequest() {}

// convenience method to extend both response and request in one fell swoop
function extendExpress() {
  extendRequest();
  extendResponse();
}

module.exports = {
  extendResponse,
  extendRequest,
  extendExpress,
};
