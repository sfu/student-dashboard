const axios = require('axios');
const debug = require('debug')('snap:server:getUserBio');

module.exports = async function getUserBio(username, token, req) {
  debug('Getting userBio for %s', username);
  const urlBase = token
    ? 'https://api.its.sfu.ca/aobrest/v1'
    : 'https://rest.its.sfu.ca/cgi-bin/WebObjects/AOBRestServer.woa/rest';
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {
        Authentication: req.headers.authorization.split(' ')[1],
      };
  try {
    const bio = await axios({
      method: 'get',
      url: `${urlBase}/datastore2/global/userBio.js?username=${username}`,
      headers,
    });
    return bio.data;
  } catch (e) {
    debug(`Error in getUserBio: %s`, e.response.data);
    throw new Error(e.response.data);
  }
};
