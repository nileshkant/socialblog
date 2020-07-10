import { Router } from 'express'
import axios from 'axios'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    const movieDetails = await axios.get(
      `http://www.omdbapi.com/?t=${name}&apikey=dd80fc93`
    )
    if (movieDetails && movieDetails.data && movieDetails.data.Error) {
      res.status(404).json(movieDetails.data)
    }
    if (movieDetails && movieDetails.data) {
      res.status(200).json(movieDetails.data)
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

export default router
