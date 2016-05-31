import {Router} from 'express'
import bodyParser from 'body-parser'

import {
  authenticateUser,
  handleSingleSignout,
  getUser,
  getProxyTicket,
  getOauthCredentials,
  provisionOrUpdateUser
} from '../auth-middleware'

const router = Router()

router.get('/',
  authenticateUser,
  getUser,
  getProxyTicket,
  getOauthCredentials,
  provisionOrUpdateUser,
  (req, res) => {
    res.redirect(req.REDIRECT_AFTER_LOGIN)
  }
)

router.post('/',
  bodyParser.urlencoded({extended:false}),
  handleSingleSignout
)

export default router
