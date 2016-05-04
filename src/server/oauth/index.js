import axios from 'axios'
import qs from 'qs'

export function getAccessToken(ticket) {
  return axios({
    method: 'post',
    url: process.env.PORTAL_OAUTH_CAS_GRANT_URL,
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
    url: process.env.PORTAL_OAUTH_REFRESH_GRANT_URL,
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

export function validateAccessToken(token) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: process.env.PORTAL_OAUTH_VALIDATE_ACCESS_TOKEN_URL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.status === 200) {
        resolve(true)
      } else {
        reject(false)
      }
    }).catch(() => {
      reject(false)
    })
  })
}
