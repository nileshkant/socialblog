import { Router } from 'express'
import axios from 'axios'

const router = Router()

/**
 * get embed Url object from noEmbed
 * @date 2020-06-01
 * @param {any} '/api/noembed/'
 * @param {String} req.query.url
 * @returns {Object}
 */
router.get('/', async (req, res) => {
  try {
    const url = req.query.url
    const embedUrl = await axios.get(
      `https://noembed.com/embed?url=${url}&maxwidth=500`
    )
    if (embedUrl) {
      res.status(200).json(embedUrl.data)
    }
  } catch (err) {
    res.status(404).json({ msg: 'Url not found' })
  }
})

export default router
