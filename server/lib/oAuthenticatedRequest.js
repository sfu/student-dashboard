import axios from 'axios'
import {validateAccessToken, refreshAccessToken, getAccessToken} from '../oauth'
import cas from '../cas-client'
import { loadUser, updateOAuthCredentialsForUser } from './index'

const debug = require('debug')('snap:server:oAuthenticatedRequest')

export default async function(req, res, config) {

  const { username } = req.session.user
  const { user } = req.session

  // get oauth credentials for user from database
  const oauthCredentials = await loadUser(username, ['oauth_access_token', 'oauth_refresh_token', 'oauth_valid_until'])
  const {
    oauth_access_token: access_token,
    oauth_refresh_token: refresh_token,
    oauth_valid_until: valid_until
  } = oauthCredentials
  console.log({access_token, refresh_token, valid_until})
  let updateCredentials = {}

  debug('Attempting to make OAuthenticated Request to %s for user %s using token %s', config.url, username, access_token)

  const accessTokenValid = await validateAccessToken(access_token, valid_until)
  debug('Access token valid? %s', accessTokenValid)

  if (!accessTokenValid) {
    // if the user has no access_token or refresh_token, just go straight to CAS and try to get them
    if (!refresh_token || !access_token) {
      debug('User has no OAuth credentials in user record; going to CAS')
      try {
        const proxyTicket = await cas.getProxyTicketAsync(req.session.casAttributes.PGTIOU, process.env.PORTAL_SERVICE_NAME)
        debug('Got proxy ticket: %s', proxyTicket)

        const newCredentialsResponse = await getAccessToken(proxyTicket)
        debug('Got OAuth credentials: %s', JSON.stringify(newCredentialsResponse.data))

        if (newCredentialsResponse.data && newCredentialsResponse.data.access_token) {
          updateCredentials = newCredentialsResponse.data
        }
      } catch(e) {
        throw new Error('ERR_CREDENTIALS_INVALID')
      }
    } else {
      // attempt to refresh the token using the refresh_token
      debug('Attempting to refresh access token')
      try {
        const refreshResponse = await refreshAccessToken(refresh_token)
        updateCredentials = refreshResponse.data
        debug('Access token refreshed')
      } catch(refreshErr) {
        const {response} = refreshErr
        debug('Could not refresh access token: %s', response.data.error)
        // expired or revoked refresh_token

        if (response && response.data.error === 'invalid_grant') {
          debug('Attempting to get new credentials via CAS')
          // try to get new credentials via CAS
          try {
            const proxyTicket = await cas.getProxyTicketAsync(req.session.casAttributes.PGTIOU, process.env.PORTAL_SERVICE_NAME)
            debug('Got proxy ticket: %s', proxyTicket)
            const newCredentialsResponse = await getAccessToken(proxyTicket)
            console.log(newCredentialsResponse.data)
            debug('Got OAuth credentials: %s', JSON.stringify(newCredentialsResponse.data))
            if (newCredentialsResponse.data && newCredentialsResponse.data.access_token) {
              updateCredentials = newCredentialsResponse.data
            }
          } catch(casError) {
            debug('Caught Error %s', casError)
            throw new Error('ERR_CREDENTIALS_INVALID')
          }
        } else {
        // something else went wrong
          debug('Something is wrong: %s', JSON.stringify(response.data))
          throw new Error(response)
        }
      }
    }
  }

  // if we got updated credentials, we need to persist them to the database
  if (Object.keys(updateCredentials).length > 0) {
    try {
      await updateOAuthCredentialsForUser(username, updateCredentials)
    } catch(e) {
      debug('Error updating user record with new OAuth credentials: %s', e)
    }
  }

  // if we've made it this far, we have a valid access_token,
  // so let's go ahead and make our actual request
  const request = axios.create()
  request.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${updateCredentials.access_token || access_token}`
    return config
  })

  return new Promise((resolve, reject) => {
    request(config).then((response) => {
      if (response.status === 200) {
        resolve(response)
      } else {
        reject(response)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}
