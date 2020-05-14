import { Router } from 'express'
import axios from 'axios'
import { OPENWEATHER_APPID } from '../../env'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { lat, lon } = req.query
    const weatherReport = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_APPID}`
    )
    console.log('weatherReport', weatherReport.data)

    if (weatherReport && weatherReport.data) {
      res.status(200).json({ weather: weatherReport.data })
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

export default router
