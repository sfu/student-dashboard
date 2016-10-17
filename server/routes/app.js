import { Router } from 'express'
import { loggedin } from '../auth-middleware'
import { readHtmlFile } from '../lib'
const router = Router()

router.get('/', loggedin, async (req, res) => {
  try {
    const html = await readHtmlFile('snap.html', req.app)
    res.set('content-type','text/html')
    res.send(html)
    res.end()
  } catch(e) {
    return res.boom.badImplementation(e)
  }
})

export default router
