import { Router } from 'express';
import bodyParser from 'body-parser';

import {
  authenticateCasUser,
  handleSingleSignout,
  getUser,
  getProxyTicket,
  provisionOrUpdateUser,
} from '../auth-middleware';

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

export default router;
