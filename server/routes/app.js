import { Router } from 'express'
import { loggedin } from '../auth-middleware'
import { readHtmlFile } from '../lib'
const debug = require('debug')('snap:server:routes:app')

const router = Router()

router.get('/', loggedin, async (req, res) => {
  try {
    debug('%s - Reading webpack manifest files', req.id)
    /// read in manifest.json - use to get CSS, JS filenames
    const manifest = await readHtmlFile('manifest.json', req.app)
    // read in chunk-manifest.json - webpackManifest
    const chunkManifest = (await readHtmlFile('chunk-manifest.json', req.app)).toString()

    const state = JSON.stringify({
      transitBookmarks: JSON.parse(req.session.user.transit_bookmarks_text)
    })

    debug('%s - Rendering view for user %s', req.id, req.username)
    res.render('index', {
      manifest: JSON.parse(manifest),
      chunkManifest,
      state
    })
  } catch(e) {
    debug('%s - Error rendering app: %s', e.message)
    res.boom.badImplementation()
  }
})

export default router
