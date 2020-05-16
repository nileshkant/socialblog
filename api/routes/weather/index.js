import { Router } from 'express'
import axios from 'axios'
import { OPENWEATHER_APPID } from '../../env'

const router = Router()

router.get('/', async (req, res) => {
  try {
    let weatherReport = null
    const { lat, lon, zip } = req.query
    if (zip) {
      weatherReport = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?zip=${zip}&units=metric&appid=${OPENWEATHER_APPID}`
      )
    } else {
      weatherReport = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_APPID}`
      )
    }
    if (weatherReport && weatherReport.data) {
      res.status(200).json({ weather: weatherReport.data })
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

export default router
