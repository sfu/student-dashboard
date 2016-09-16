import {validateAccessToken, refreshAccessToken, getAccessToken} from '../oauth'
import axios from 'axios'
import cas from '../cas-client'

export default async function(req, res, config) {
  const accessTokenValid = await validateAccessToken(req.session.oAuth.access_token, req.session.oAuth.valid_until)
  if (!accessTokenValid) {
    // attempt to refresh the token using the refresh_token
    try {
      const refreshResponse = await refreshAccessToken(req.session.oAuth.refresh_token)
      req.session.oAuth = refreshResponse.data
    } catch(refreshErr) {
      const {response} = refreshErr

      // expired or revoked refresh_token
      if (response && response.data.error === 'invalid_grant') {
        // try to get new credentials via CAS
        try {
          const proxyTicket = await cas.getProxyTicketAsync(req.session.casAttributes.PGTIOU, process.env.PORTAL_SERVICE_NAME)
          const newCredentialsResponse = await getAccessToken(proxyTicket)
          if (newCredentialsResponse.data && newCredentialsResponse.data.access_token) {
            req.session.oAuth = newCredentialsResponse.data
          }
        } catch(casError) {
          throw new Error('ERR_CREDENTIALS_INVALID')
        }
      } else {
      // something else went wrong
        throw new Error(response)
      }
    }
  }

  // if we've made it this far, we have a valid access_token,
  // so let's go ahead and make our actual request
  const request = axios.create()
  request.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${req.session.oAuth.access_token}`
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
