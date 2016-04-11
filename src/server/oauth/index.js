import axios from 'axios'
import qs from 'qs'

export function getAccessToken(ticket) {
  return axios({
    method: 'post',
    url: process.env.PORTAL_OAUTH_URL,
    data: {
      client_id: process.env.PORTAL_OAUTH_CLIENT_ID,
      client_secret: process.env.PORTAL_OAUTH_SECRET,
      ticket
    },
    transformRequest(data) {
      return qs.stringify(data)
    }
  })
}

export function refreshAccessToken(refresh_token) {
  return axios({
    method: 'post',
    url: process.env.PORTAL_OAUTH_URL,
    data: {
      client_id: process.env.PORTAL_OAUTH_CLIENT_ID,
      client_secret: process.env.PORTAL_OAUTH_SECRET,
      grant_type: 'refresh_token',
      refresh_token
    },
    transformRequest(data) {
      return qs.stringify(data)
    }
  })
}
