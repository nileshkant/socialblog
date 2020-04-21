import { Router } from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import { Article, Category } from './modal'
const router = Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    if (req.user.role === 'user') {
      return res.send(401, 'unauthorised')
    } else {
      next()
    }
  },
  async (req, res) => {
    const { message, ...restfield } = req.body
    const textArr = message.map((msg) => {
      const messageArr = {
        message: msg,
        commentedUser: req.user._id,
        postType: 'post'
      }
      return messageArr
    })
    const article = new Article({
      ...restfield,
      text: textArr,
      author: req.user._id
    })
    await article.save((err, data) => {
      if (err) {
        res.send(400, err)
        return
      }
      res.status(200).json({ savedArticle: data })
    })
  }
)

router.post(
  '/create-category',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    if (req.user.role === 'user') {
      return res.send(401, 'unauthorised')
    } else {
      next()
    }
  },
  async (req, res) => {
    const { name } = req.body
    const category = new Category({
      name,
      createdBy: req.user._id
    })
    await category.save((_, data) => {
      res.status(200).json({ category: data })
    })
  }
)

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

export default router
