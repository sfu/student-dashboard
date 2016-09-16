import axios from 'axios'
import qs from 'qs'

const addValidUntil = (data) => {
  try {
    data = JSON.parse(data)
    if (data.hasOwnProperty('expires_in')) {
      data.valid_until = new Date(Date.now() + ((data.expires_in - 300) * 1000)).getTime()
    }
    return data
  } catch(e) {
    return data
  }
}

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
    },
    transformResponse(data) {
      return addValidUntil(data)
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
    },
    transformResponse(data) {
      return addValidUntil(data)
    }
  })
}

export function validateAccessToken(token, valid_until) {
  if (Date.now >= valid_until) { return false }

  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: process.env.PORTAL_OAUTH_VALIDATE_ACCESS_TOKEN_URL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      resolve(true)
    }).catch((err) => {
      if (err.response.status === 401) {
        resolve(false)
      } else {
        reject(err)
      }
    })
  })
}
