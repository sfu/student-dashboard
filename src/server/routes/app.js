import {Router} from 'express'
import {loggedin} from '../auth-middleware'

const router = Router()

router.get('/', loggedin, (req, res) => {
  res.status(200).send('OK From Router')
})

export default router
