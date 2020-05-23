import { Router } from 'express'
import axios from 'axios'

const router = Router()

router.get('/summary', async (req, res) => {
  try {
    const covidStatus = await axios.get(`https://api.covid19api.com/summary`)
    if (covidStatus && covidStatus.data) {
      res.status(200).json(covidStatus.data)
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

export default router
