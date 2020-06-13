import { Router } from 'express'
import { embedObj, websiteDetails } from './fetchWebsite'

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
    const embedUrl = await embedObj(url)
    if (embedUrl) {
      res.status(200).json(embedUrl.data)
    }
  } catch (err) {
    res.status(404).json({ msg: 'Url not found' })
  }
})

router.get('/url-info', async (req, res) => {
  try {
    const url = req.query.url
    const data = await websiteDetails(url)
    if (data) {
      res.status(200).json(data)
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

export default router
