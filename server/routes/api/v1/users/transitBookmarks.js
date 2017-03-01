import { Router } from 'express'
import { validate } from 'express-jsonschema'
import bodyParser from 'body-parser'

import {
  BOOKMARK_SCHEMA,
  TRANSIT_BOOKMARKS_TABLE,
  getEstimatesForBookmarks,
  getBookmarksForUser,
  addBookmark,
  ownsBookmark
} from '../../../../lib'

import db from '../../../../db'

const UNIQUE_VIOLATION = '23505'

const debug = require('debug')('snap:server:routes:api/v1/users/transitBookmarks')

const router = Router({ mergeParams: true })

router.use(bodyParser.json())

router.get('/', async (req, res) => {
  let { username } = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }

  debug('%s - Getting transit bookmarks for %s', req.id, username)
  try {
    const bookmarks = await getBookmarksForUser(user.id)
    res.send(bookmarks)
  } catch(e) {
    debug('%s - Error getting transit bookmarks for %s: %s', req.id, username, e.message)
    res.boom.badImplementation()
  }
})

router.post('/', validate({body: BOOKMARK_SCHEMA}), async (req, res) => {
  let { username } = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }

  debug('%s - Add transit bookmark %s for user %s', req.id, JSON.stringify(req.body), username)
  try {
    // Try to insert the bookmark. If it is a duplicate, it'll fail with a 23505 error from PG
    const payload = {
      user_id: user.id,
      ...req.body
    }
    await addBookmark(payload)
    const nextBookmarks = await getBookmarksForUser(user.id)
    res.send(nextBookmarks)
  } catch (e) {
    const { code } = e
    if (code && code === UNIQUE_VIOLATION) {
      // Duplicate entry, not an actual error
      const nextBookmarks = await getBookmarksForUser(user.id)
      res.send(nextBookmarks)
    } else {
      debug('%s - Error updating transit bookmarks: %s', req.id, e.message)
      res.boom.badImplementation()
    }
  }
})

router.delete('/', validate({body: BOOKMARK_SCHEMA}), async (req, res) => {
  let { username } = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }

  debug('%s - Delete bookmark %s for user %s', req.id, JSON.stringify(req.body), username)
  try {
    const bookmark = await db(TRANSIT_BOOKMARKS_TABLE).where({
      user_id: user.id,
      ...req.body
    }).first()
    if (!bookmark) {
      return res.boom.notFound()
    }
    await db(TRANSIT_BOOKMARKS_TABLE).where({ id: bookmark.id }).del()
    const nextBookmarks = await getBookmarksForUser(user.id)
    res.send(nextBookmarks)
  } catch (e) {
    debug('%s - Error deleting transit bookmark: %s', req.id, e.message)
    res.boom.badImplementation()
  }
})

router.delete('/:id', ownsBookmark, async (req, res) => {
  let { username } = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }
  const { id } = req.params

  debug('%s - Delete bookmark by ID %s for user %s', req.id, id, username)

  try {
    await db(TRANSIT_BOOKMARKS_TABLE).where({ id }).del()
    const nextBookmarks = await(getBookmarksForUser(user.id))
    res.send(nextBookmarks)
  } catch(e) {
    debug('%s - Error deleting transit bookmark: %s', req.id, e.message)
    res.boom.badImplementation()
  }

})

router.get('/estimates', async (req, res) => {
  let { username } = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }

  try {
    debug('%s - Getting transit bookmark estimates for %s', req.id, username)
    const cache = req.app.get('TRANSLINK_CACHE')
    const bookmarks = await getBookmarksForUser(user.id)
    const estimates = await getEstimatesForBookmarks(bookmarks, cache)
    res.send(estimates)
  } catch (e) {
    debug('%s - Error getting transit bookmark estimates for %s: %s', req.id, username, e.message)
    res.boom.badImplementation()
  }
})

export default router
