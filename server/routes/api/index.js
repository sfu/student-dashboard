const { Router } = require('express');
const v1 = require('./v1');
const {
  loggedInWithSession,
  loggedInWithJwt,
  redirectToLoginIfNecessary,
  getUser,
  provisionOrUpdateUser,
} = require('../../auth-middleware');

const router = Router({ mergeParams: true });

router.use(function isApiRequest(req, res, next) {
  if (req.headers.accept !== 'application/json') {
    req.headers.accept = 'application/json';
  }
  req.isApiRequest = true;
  next();
});

router.use(
  '/v1',
  loggedInWithSession,
  loggedInWithJwt,
  redirectToLoginIfNecessary,
  getUser,
  provisionOrUpdateUser,
  v1
);

module.exports = router;
