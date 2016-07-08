import {Router} from 'express'
import bodyParser from 'body-parser'

import {
  authenticateCasUser,
  handleSingleSignout,
  getUser,
  getProxyTicket,
  getOauthCredentials,
  provisionUser
} from '../auth-middleware'

const router = Router()

router.get('/login/cas',
  authenticateCasUser,
  getUser,
  getProxyTicket,
  getOauthCredentials,
  provisionUser,
  (req, res) => {
    res.redirect(req.session.redirectTo)
  }
)

router.post('/login/cas',
  bodyParser.urlencoded({extended:false}),
  handleSingleSignout
)

export default router
