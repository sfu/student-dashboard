import {Router} from 'express'
import bodyParser from 'body-parser'

import {
  authenticateCasUser,
  handleSingleSignout,
  getUser,
  getProxyTicket,
  getOauthCredentials,
  provisionOrUpdateUser
} from '../auth-middleware'

const router = Router()

router.get('/login/cas',
  authenticateCasUser,
  getUser,
  getProxyTicket,
  getOauthCredentials,
  provisionOrUpdateUser,
  (req, res) => {
    res.redirect(req.session.redirectTo)
  }
)

router.post('/',
  bodyParser.urlencoded({extended:false}),
  handleSingleSignout
)

export default router
