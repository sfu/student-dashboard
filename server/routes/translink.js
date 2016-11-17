import { Router } from 'express'
import axios from 'axios'
const debug = require('debug')('snap:server:routes:translink')

const router = Router()

router.get('*', async (req, res) => {
  const { TRANSLINK_API_URL, TRANSLINK_API_KEY } = process.env
  const { url } = req
  try {
    const result = await axios({
      method: 'get',
      url: `${TRANSLINK_API_URL}${url}`,
      params: {
        apikey: TRANSLINK_API_KEY
      },
      headers: {
        accept: 'application/json'
      }
    })
    res.send(result.data)
  } catch(e) {
    debug(e.response)
    res.boom.badImplementation()
  }
})

export default router
