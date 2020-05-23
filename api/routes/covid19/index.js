import { Router } from 'express'
import axios from 'axios'
const util = require('util')
const redis = require('redis')

const client = redis.createClient()
client.hget = util.promisify(client.hget)

const router = Router()

router.get('/summary', async (req, res) => {
  try {
    const cacheValue = await client.hget('covid19', 'covidData')
    if (!JSON.parse(cacheValue)) {
      const covidStatus = await axios.get(`https://api.covid19api.com/summary`)
      if (covidStatus && covidStatus.data) {
        client.hset(
          'covid19',
          'covidData',
          JSON.stringify({
            Global: covidStatus.data.Global,
            Date: covidStatus.data.Date
          })
        )
        client.expire('covid19', 60 * 30)
        res.status(200).json({
          Global: covidStatus.data.Global,
          Date: covidStatus.data.Date
        })
      }
    } else {
      res.status(200).json(JSON.parse(cacheValue))
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

export default router
