const { Router } = require('express');
const { validate } = require('express-jsonschema');
const bodyParser = require('body-parser');
const isEqual = require('lodash/isEqual');
const {
  BOOKMARK_SCHEMA,
  TRANSIT_BOOKMARKS_TABLE,
  getBookmarksForUser,
  addBookmark,
  ownsBookmark,
} = require('../../../../lib/transitBookmarks');
const { getEstimatesForBookmarks } = require('../../../../lib/translink');
const db = require('../../../../db');

const UNIQUE_VIOLATION = '23505';

const debug = require('debug')(
  'snap:server:routes:api/v1/users/transitBookmarks'
);

const router = Router({ mergeParams: true });

router.use(bodyParser.json());

router.get('/', async (req, res) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }

  debug('%s - Getting transit bookmarks for %s', req.id, username);
  try {
    const bookmarks = await getBookmarksForUser(user.id);
    res.send(bookmarks);
  } catch (e) {
    debug(
      '%s - Error getting transit bookmarks for %s: %s',
      req.id,
      username,
      e.message
    );
    res.boom.badImplementation();
  }
});

router.post('/', validate({ body: BOOKMARK_SCHEMA }), async (req, res) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }

  debug(
    '%s - Add transit bookmark %s for user %s',
    req.id,
    JSON.stringify(req.body),
    username
  );
  try {
    // Try to insert the bookmark. If it is a duplicate, it'll fail with a 23505 error from PG
    const payload = {
      user_id: user.id,
      ...req.body,
    };
    await addBookmark(payload);
    const nextBookmarks = await getBookmarksForUser(user.id);
    res.send(nextBookmarks);
  } catch (e) {
    const { code } = e;
    if (code && code === UNIQUE_VIOLATION) {
      // Duplicate entry, not an actual error
      const nextBookmarks = await getBookmarksForUser(user.id);
      res.send(nextBookmarks);
    } else {
      debug('%s - Error updating transit bookmarks: %s', req.id, e.message);
      res.boom.badImplementation();
    }
  }
});

router.delete('/', validate({ body: BOOKMARK_SCHEMA }), async (req, res) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }

  debug(
    '%s - Delete bookmark %s for user %s',
    req.id,
    JSON.stringify(req.body),
    username
  );
  try {
    // get existing bookmarks from db
    const bookmarksText = (
      await db('users').where({ username }).select('transit_bookmarks_text')
    )[0];
    const bookmarksJson = JSON.parse(bookmarksText.transit_bookmarks_text);
    req.body.destination = req.body.destination.toUpperCase();
    const nextBookmarks = bookmarksJson.filter((b) => !isEqual(b, req.body));
    if (!isEqual(nextBookmarks, bookmarksJson)) {
      const nextBookmarksText = JSON.stringify(nextBookmarks);
      debug('%s - Saving new bookmarks to DB: %s', req.id, nextBookmarksText);
      const result = await db('users')
        .where({ username })
        .update({ transit_bookmarks_text: nextBookmarksText });
      debug('%s - DB update result: %s', req.id, result);
    }
    res.send(nextBookmarks);
  } catch (e) {
    debug('%s - Error deleting transit bookmark: %s', req.id, e.message);
    res.boom.badImplementation();
  }
});

router.delete('/:id', ownsBookmark, async (req, res) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }
  const { id } = req.params;

  debug('%s - Delete bookmark by ID %s for user %s', req.id, id, username);

  try {
    await db(TRANSIT_BOOKMARKS_TABLE).where({ id }).del();
    const nextBookmarks = await getBookmarksForUser(user.id);
    res.send(nextBookmarks);
  } catch (e) {
    debug('%s - Error deleting transit bookmark: %s', req.id, e.message);
    res.boom.badImplementation();
  }
});

router.get('/estimates', async (req, res) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }

  try {
    debug('%s - Getting transit bookmark estimates for %s', req.id, username);
    const cache = req.app.get('TRANSLINK_CACHE');
    const bookmarks = await getBookmarksForUser(user.id);
    const estimates = await getEstimatesForBookmarks(bookmarks, cache);
    res.send(estimates);
  } catch (e) {
    console.log(e);
    debug(
      '%s - Error getting transit bookmark estimates for %s: %s',
      req.id,
      username,
      e.message
    );
    res.boom.badImplementation();
  }
});

module.exports = router;
