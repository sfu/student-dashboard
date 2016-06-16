import axios from 'axios'

export default async function getUserBio(username, token, req) {
  const urlBase = token ? 'https://api.its.sfu.ca/aobrest/v1' : 'https://rest.its.sfu.ca/cgi-bin/WebObjects/AOBRestServer.woa/rest'
  const headers = token ? {
    'Authorization': `Bearer ${token}`
  } : {
    'Authentication': req.headers.authorization.split(' ')[1]
  }
  try {
    const bio = await axios({
      method: 'get',
      url: `${urlBase}/datastore2/global/userBio.js?username=${username}`,
      headers
    })
    return bio.data
  } catch (e) {
    throw new Error(e.data)
  }
}
