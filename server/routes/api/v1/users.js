import { Router } from 'express'
import { validate } from 'express-jsonschema'
import bodyParser from 'body-parser'
import { getEstimatesForBookmarks } from '../../../lib'
import isEqual from 'lodash/isEqual'
import db from '../../../db'

const BOOKMARK_SCHEMA = {
  type: 'object',
  properties: {
    stop: {
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 5
    },
    route: {
      type: 'string',
      required: true
    },
    destination: {
      type: 'string',
      required: true
    }
  }
}

const debug = require('debug')('snap:server:routes:api/v1/users')

const router = Router()

router.get('/:username/transitBookmarks', async (req, res) => {
  let {username} = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }

  debug('%s - Getting transit bookmarks for %s', req.id, username)
  try {
    const bookmarksText = (await db('users').where({username}).select('transit_bookmarks_text'))[0]
    const bookmarksJson = JSON.parse(bookmarksText.transit_bookmarks_text)
    res.send(bookmarksJson)
  } catch(e) {
    debug('%s - Error getting transit bookmarks for %s: %s', req.id, username, e.message)
    res.boom.badImplementation()
  }
})

router.post('/:username/transitBookmarks', bodyParser.json(), validate({body: BOOKMARK_SCHEMA}), async (req, res) => {
  let {username} = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }

  debug('%s - Add transit bookmark %s for user %s', req.id, JSON.stringify(req.body), username)
  try {
    // get existing bookmarks from db
    const bookmarksText = (await db('users').where({username}).select('transit_bookmarks_text'))[0]
    const bookmarksJson = JSON.parse(bookmarksText.transit_bookmarks_text)
    const nextBookmarks = [...bookmarksJson]

    const alreadyBookmarked = !!bookmarksJson.find(b => isEqual(b, req.body))
    debug('%s - Already Bookmarked? %s', req.id, alreadyBookmarked)
    if (!alreadyBookmarked) {
      debug('%s - New bookmark - adding to existing bookmarks', req.id)

      nextBookmarks.push(req.body)
      const result = await db('users').where({username}).update({transit_bookmarks_text: JSON.stringify(nextBookmarks)})
      debug('%s - DB update result: %s', req.id, result)
    }
    res.send(nextBookmarks)

  } catch (e) {
    debug('%s - Error updating transit bookmarks: %s', req.id, e.message)
    res.boom.badImplementation()
  }
})

router.delete('/:username/transitBookmarks', bodyParser.json(), validate({body: BOOKMARK_SCHEMA}), async (req, res) => {
  let {username} = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }

  debug('%s - Delete bookmark %s for user %s', req.id, JSON.stringify(req.body), username)
  try {
    // get existing bookmarks from db
    const bookmarksText = (await db('users').where({username}).select('transit_bookmarks_text'))[0]
    const bookmarksJson = JSON.parse(bookmarksText.transit_bookmarks_text)

    const nextBookmarks = bookmarksJson.filter(b => !isEqual(b, req.body))
    if (!isEqual(nextBookmarks, bookmarksJson)) {
      const nextBookmarksText = JSON.stringify(nextBookmarks)
      debug('%s - Saving new bookmarks to DB: %s', req.id, nextBookmarksText)
      const result = await db('users').where({username}).update({transit_bookmarks_text: nextBookmarksText})
      debug('%s - DB update result: %s', req.id, result)
    }
    res.send(nextBookmarks)
  } catch (e) {
    debug('%s - Error deleting transit bookmark: %s', req.id, e.message)
    res.boom.badImplementation()

  }
})

router.get('/:username/transitBookmarks/estimates', async (req, res) => {
  let {username} = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }

  try {
    debug('%s - Getting transit bookmark estimates for %s', req.id, username)
    const cache = req.app.get('TRANSLINK_CACHE')
    const bookmarksText = (await db('users').where({username}).select('transit_bookmarks_text'))[0]
    const bookmarks = JSON.parse(bookmarksText.transit_bookmarks_text)
    const estimates = await getEstimatesForBookmarks(bookmarks, cache)
    res.send(estimates)
  } catch (e) {
    debug('%s - Error getting transit bookmark estimates for %s: %s', req.id, username, e.message)
    res.boom.badImplementation()
  }
})

router.get('/:username', async (req, res) => {
  let {username} = req.params
  let user = req.username.user || req.session.user
  if (username === 'self') {
    username = user.username
  }
  debug('%s - Getting user profile for %s', req.id, username)
  if (username !== req.user.username) {
    res.boom.unauthorized()
    return
  }

  const userRecord = (await db('users').where({username}).select(['id', 'username', 'uid', 'lastname', 'firstnames', 'commonname', 'barcode']))[0]
  if (userRecord) {
    res.send(userRecord)
  } else {
    res.boom.notFound()
  }
})

export default router
