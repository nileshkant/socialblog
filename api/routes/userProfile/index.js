import { Router } from 'express'
import mongoose from 'mongoose'
import omit from 'lodash/omit'
import { Article } from '../article/articleModal'
import { authorized } from '../../utils'
import { MultiAccountUser } from '../auth/modal'

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

router.put('/update-profile', authorized, async (req, res) => {
  try {
    const { username } = req.body
    const query = { _id: req.user._id }
    const update = {}
    if (username) {
      update.username = username
    }
    const updateUser = await MultiAccountUser.findOneAndUpdate(query, update, {
      runValidators: true,
      new: true
    })
    if (updateUser) {
      res.status(200).json(omit(updateUser, ['password']))
    }
  } catch {
    res.status(404).json({ msg: 'Username already taken' })
  }
})

export default router
