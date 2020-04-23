import { Router } from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import cloudinary from '../../core/cloudinary'
import { authorized } from '../../utils'
import { Article, Category } from './modal'
const router = Router()

router.post('/', authorized, async (req, res) => {
  const { file, ...restfield } = req.body
  const article = new Article({
    ...restfield,
    author: req.user._id
  })
  if (req.user.role === 'user') {
    article.isVerified = false
  }
  try {
    if (file) {
      const mediaUrl = await cloudinary.uploader.upload(file)
      article.mediaUrl = mediaUrl.secure_url
    }
    await article.save((err, data) => {
      if (err) {
        res.send(400, err)
        return
      }
      res.status(200).json({ savedArticle: data })
    })
  } catch (err) {
    res.status(400).json({ message: err })
  }
})

router.post('/create-category', authorized, async (req, res) => {
  const { name, summary } = req.body
  const category = new Category({
    name,
    summary,
    createdBy: req.user._id
  })
  await category.save((_, data) => {
    res.status(200).json({ category: data })
  })
})

router.post(
  '/add-comment',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id, comment } = req.body
    const addComment = { message: comment, commentedUser: req.user._id }
    const updateArticle = await Article.findOneAndUpdate(
      { _id: id },
      { $push: { text: addComment } },
      { new: true }
    )
    res.status(200).json(updateArticle)
  }
)

router.post(
  '/like',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { articleId, like } = req.body
    try {
      if (!like) {
        const deleteLike = await Article.findOneAndUpdate(
          { _id: articleId },
          { $pull: { likedBy: mongoose.Types.ObjectId(req.user._id) } },
          { new: true }
        )
        res.status(200).json(deleteLike)
      } else {
        const updateArticle = await Article.findOneAndUpdate(
          { _id: articleId },
          { $push: { likedBy: mongoose.Types.ObjectId(req.user._id) } },
          { new: true }
        )
        res.status(200).json(updateArticle)
      }
    } catch (err) {
      res.send(400, err)
    }
  }
)

router.get('/get-articles', async (req, res) => {
  const categoryPosts = req.query.categoryid
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const allArticles = await Article.find({
    categories: mongoose.Types.ObjectId(categoryPosts)
  })
    .populate('categories')
    .populate({
      path: 'commentedUser',
      model: 'MultiAccountUser',
      select: { password: 0, permissions: 0 }
    })
    .populate({
      path: 'author',
      model: 'MultiAccountUser',
      select: { password: 0, permissions: 0 }
    })
    .populate({
      path: 'categories',
      populate: {
        path: 'createdBy',
        model: 'MultiAccountUser',
        select: { password: 0, permissions: 0 }
      }
    })
    .limit(limit)
    .skip(limit * (page - 1))
    .exec()
  const resArticle = []
  allArticles.forEach((doc) => {
    resArticle.push(doc)
  })
  res.status(200).json(resArticle)
})

router.get('/categories', async (req, res) => {
  const allCategories = await Category.find()
  const categories = []
  allCategories.forEach((doc) => {
    categories.push(doc)
  })
  res.status(200).json(categories)
})

export default router
