import { Router } from 'express'
import mongoose from 'mongoose'
import { Article } from '../article/articleModal'
import { authorized } from '../../utils'

const router = Router()

router.get('/get-posts', authorized, async (req, res) => {
  try {
    const user = req.user._id
    const limit = Number(req.query.pageSize) || 50
    const page = Number(req.query.page) || 1
    const allArticles = await Article.find({
      author: mongoose.Types.ObjectId(user)
    })
      .populate('categories')
      .sort({ createdDate: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .exec()
    const resArticle = []
    allArticles.forEach((doc) => {
      resArticle.push(doc)
    })
    res.status(200).json({ articles: resArticle, pageSize: limit, page })
  } catch (err) {
    res.status(404).json({ msg: err })
  }
})

export default router
