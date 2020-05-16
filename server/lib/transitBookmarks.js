import db from '../db';
const debug = require('debug')('snap:server:lib:transitBookmarks');

export const BOOKMARK_SCHEMA = {
  type: 'object',
  properties: {
    stop: {
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 5,
    },
    route: {
      type: 'string',
      required: true,
    },
    destination: {
      type: 'string',
      required: true,
    },
  },
};

export const TRANSIT_BOOKMARKS_TABLE = 'transit_bookmarks';

export const getBookmarksForUser = async (
  user_id,
  columns = ['id', 'stop', 'route', 'destination']
) => {
  try {
    return await db(TRANSIT_BOOKMARKS_TABLE).where({ user_id }).select(columns);
  } catch (e) {
    throw e;
  }
};

export const getBookmarkById = async (
  id,
  columns = ['id', 'stop', 'route', 'destination']
) => {
  try {
    return await db(TRANSIT_BOOKMARKS_TABLE).where({ id }).first(columns);
  } catch (e) {
    throw e;
  }
};

export const addBookmark = async (payload) => {
  try {
    await db(TRANSIT_BOOKMARKS_TABLE).insert(payload);
  } catch (e) {
    throw e;
  }
};

export const ownsBookmark = async (req, res, next) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }

  const userId = user.id;
  const { id } = req.params;
  try {
    const bookmark = await getBookmarkById(id, ['id', 'user_id']);
    if (!bookmark) {
      res.boom.notFound();
    } else if (bookmark.user_id === userId) {
      next();
    } else {
      res.boom.unauthorized();
    }
  } catch (e) {
    debug(
      '%s - Error in `ownsBookmark` middleware for user %s: %s',
      req.id,
      username,
      e
    );
    res.boom.badImplementation();
  }
};
