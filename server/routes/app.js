import { Router } from 'express'
import {
  loggedInWithSession,
  redirectToLoginIfNecessary
} from '../auth-middleware'
import { readHtmlFile } from '../lib'
import db from '../db'
const debug = require('debug')('snap:server:routes:app')

const router = Router()

router.get('/', loggedInWithSession, redirectToLoginIfNecessary, async (req, res) => {
  try {
    debug('%s - Reading webpack manifest files', req.id)
    /// read in manifest.json - use to get CSS, JS filenames
    const manifest = await readHtmlFile('manifest.json', req.app)
    // read in chunk-manifest.json - webpackManifest
    const chunkManifest = (await readHtmlFile('chunk-manifest.json', req.app)).toString()

    const user = await db('users').where({username: req.session.user.username}).select(['transit_bookmarks_text', 'preferences_text'])
    const state = JSON.stringify({
      transitBookmarks: JSON.parse(user[0].transit_bookmarks_text),
      preferences: JSON.parse(user[0].preferences_text)
    })

    debug('%s - Rendering view for user %s', req.id, req.session.username)
    res.render('index', {
      manifest: JSON.parse(manifest),
      chunkManifest,
      state,
      production: process.env.NODE_ENV === 'production'
    })
  } catch(e) {
    debug('%s - Error rendering app: %s', req.id, e.message)
    res.boom.badImplementation()
  }
})

export default router
