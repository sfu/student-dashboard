import db from '../db'

const debug = require('debug')('snap:server:updateOAuthCredentialsForUser')

export default async function updateOAuthCredentialsForUser(username, {access_token, refresh_token, valid_until}) {
  debug('Attempting to update user record for %s with new OAuth credentials %s', username, JSON.stringify({access_token, refresh_token, valid_until}))
  try {
    const result = await db('users').where({username}).update({
      oauth_access_token: access_token,
      oauth_refresh_token: refresh_token,
      oauth_valid_until: valid_until instanceof Date ? valid_until : new Date(valid_until)
    }).returning('*')
    return result.length ? result[0] : null
  } catch(e) {
    throw(e)
  }
}
