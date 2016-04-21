import {Router} from 'express'
import {loggedin} from '../auth-middleware'

const router = Router()

router.use(loggedin)

router.get('/', (req, res) => {
  res.status(200).send('OK From Router')
})
