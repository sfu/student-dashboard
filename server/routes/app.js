const { Router } = require('express');
const {
  loggedInWithSession,
  redirectToLoginIfNecessary,
} = require('../auth-middleware');
const readHtmlFile = require('../lib/readHtmlFile');
const { getBookmarksForUser } = require('../lib/transitBookmarks');

const db = require('../db');

const debug = require('debug')('snap:server:routes:app');

const router = Router();

router.get(
  '/',
  loggedInWithSession,
  redirectToLoginIfNecessary,
  async (req, res) => {
    try {
      debug('%s - Reading webpack manifest files', req.id);
      /// read in manifest.json - use to get CSS, JS filenames
      const manifest = await readHtmlFile('manifest.json', req.app);
      // read in chunk-manifest.json - webpackManifest
      const chunkManifest = (
        await readHtmlFile('chunk-manifest.json', req.app)
      ).toString();

      const preferences = await db('users')
        .where({ username: req.session.user.username })
        .select(['preferences_text'])
        .first();
      const transitBookmarks = await getBookmarksForUser(req.session.user.id);
      const state = JSON.stringify({
        transitBookmarks,
        preferences: JSON.parse(preferences.preferences_text),
      });

      debug('%s - Rendering view for user %s', req.id, req.session.username);
      res.render('index', {
        manifest: JSON.parse(manifest),
        chunkManifest,
        state,
        production: process.env.NODE_ENV === 'production',
      });
    } catch (e) {
      debug('%s - Error rendering app: %s', req.id, e.message);
      res.boom.badImplementation();
    }
  }
);

module.exports = router;
