const { Router } = require('express');
const bodyParser = require('body-parser');

const {
  authenticateCasUser,
  handleSingleSignout,
  getUser,
  getProxyTicket,
  provisionOrUpdateUser,
} = require('../auth-middleware');

const router = Router();

router.get(
  '/login/cas',
  authenticateCasUser,
  getUser,
  getProxyTicket,
  provisionOrUpdateUser,
  (req, res) => {
    req.session.user = req.user;
    res.redirect(req.session.redirectTo);
  }
);

router.post(
  '/login/cas',
  bodyParser.urlencoded({ extended: false }),
  handleSingleSignout
);

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect(`${process.env.CAS_BASE_URL}/appLogout`);
  });
});

module.exports = router;
