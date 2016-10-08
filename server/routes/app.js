import {Router} from 'express'
import {loggedin} from '../auth-middleware'

const router = Router()

router.get('/', loggedin, (req, res) => {
  res.sendFile(`${req.app.get('htmlDirectory')}/snap.html`)
})

export default router
