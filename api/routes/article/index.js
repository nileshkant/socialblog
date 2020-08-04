import { Router } from 'express'
import mongoose from 'mongoose'
import uniq from 'lodash/uniq'
import { clearHash } from '../../core/redis'
import cloudinary from '../../core/cloudinary'
import { authorized } from '../../utils'
import { websiteDetails } from '../noembed/fetchWebsite'
import { Article } from './articleModal'
import { LikeArticle } from './articleModal/otherModal'
import { Category, PostComment } from './modal'
const util = require('util')
const redis = require('redis')

const client = redis.createClient()
client.get = util.promisify(client.get)
const router = Router()

const getArticleArr = async (doc) => {
  const value = await client.get(`storyViews_${doc._id}`)
  const articleDetails = {
    ...doc,
    newViews: value ? Number(value) : 0
  }
  return articleDetails
}

router.post('/', authorized, async (req, res) => {
  try {
    const { file, articleType, ...restfield } = req.body
    const article = new Article({
      ...restfield,
      articleType,
      author: req.user && req.user._id
    })
    const regexp = new RegExp('#', 'g')
    const titleTag =
      article[articleType].title && article[articleType].title.match(/#\w+/g)
    const subtitleTag =
      article[articleType].subtitle &&
      article[articleType].subtitle.match(/#\w+/g)
    const quoteTag =
      article[articleType].quote && article[articleType].quote.match(/#\w+/g)
    const articleBodyTag =
      article[articleType].articleBody &&
      article[articleType].articleBody.match(/#\w+/g)
    const allhashtags = [
      ...(titleTag || []),
      ...(subtitleTag || []),
      ...(quoteTag || []),
      ...(articleBodyTag || [])
    ]
    if (allhashtags) {
      article.hashtags = allhashtags.map((hash) => {
        return hash.replace('#', '')
      })
      article.hashtags = article.hashtags.filter((hash) => {
        return hash
      })
      article.hashtags = uniq(article.hashtags)
      if (titleTag) {
        article[articleType].title = article[articleType].title.replace(
          regexp,
          ''
        )
      }
      if (subtitleTag) {
        article[articleType].subtitle = article[articleType].subtitle.replace(
          regexp,
          ''
        )
      }
      if (quoteTag) {
        article[articleType].quote = article[articleType].quote.replace(
          regexp,
          ''
        )
      }
      if (articleBodyTag) {
        article[articleType].articleBody = article[
          articleType
        ].articleBody.replace(regexp, '')
      }
    }
    if (file) {
      const mediaUrl = await cloudinary.uploader.upload(file)
      article[articleType].mediaUrl = mediaUrl.secure_url
      article[articleType].cloudinaryId = mediaUrl.public_id
    }
    await article.save((err, data) => {
      if (err) {
        res.status(400).json({ msg: err })
        return
      }
      res.status(200).json({ savedArticle: data })
    })
  } catch (err) {
    res.status(400).json({ message: err })
  }
})

router.post('/create-category', authorized, async (req, res) => {
  try {
    const { name, summary } = req.body
    const category = new Category({
      name,
      summary,
      createdBy: req.user._id
    })
    await category.save((_, data) => {
      clearHash('categories')
      res.status(200).json({ category: data })
    })
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

/**
 * Add comment to a post
 * @date 2020-05-09
 * @param {any} '/add-comment'
 * @param {any} authorized
 * @param {any} { articleId, textComment, file, replyComment }
 * @returns {any}
 */

router.post('/add-comment', authorized, async (req, res) => {
  try {
    const {
      articleId,
      textComment,
      file,
      replyComment,
      embedUrl,
      isMarkdown
    } = req.body
    // const regexp = new RegExp('#', 'g')
    const allhashtags = textComment && textComment.match(/#\w+/g)
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/g
    const foundUrl = textComment && textComment.match(urlRegex)
    const addComment = new PostComment({
      articleId,
      textComment,
      hashtags: [],
      replyComment,
      embedUrl,
      isMarkdown,
      commentor: req.user._id
    })
    if (foundUrl && foundUrl.length > 0) {
      try {
        const data = await websiteDetails(foundUrl[0])
        if (data) {
          addComment.embedUrl = data
        }
      } catch (err) {
        addComment.embedUrl = null
      }
    }
    if (allhashtags) {
      addComment.hashtags = allhashtags.map((hash) => {
        return hash.replace('#', '')
      })
      addComment.hashtags = addComment.hashtags.filter((hash) => {
        return hash
      })
      addComment.hashtags = uniq(addComment.hashtags)
    }
    if (file) {
      const mediaUrl = await cloudinary.uploader.upload(file)
      addComment.cloudinaryId = mediaUrl.public_id
      addComment.mediaUrl = mediaUrl.secure_url
    }
    const commented = await addComment.save()
    if (commented) {
      res.status(200).json({ newComment: commented })
    }
  } catch (err) {
    res.status(400).json({ message: err })
  }
})

/**
 * Get all comments of a post
 * @date 2020-05-09
 * @param {any} '/get-comments'
 * @param {any} res.query.articleId
 * @param {any} res.query.limit 'default : all'
 * @param {any} res.query.page
 * @returns {any}
 */
router.get('/get-comments', async (req, res) => {
  const articleId = req.query.articleId
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const allComments = await PostComment.find({
    articleId: mongoose.Types.ObjectId(articleId)
  })
    .populate({
      path: 'commentor',
      model: 'MultiAccountUser',
      select: { password: 0, permissions: 0 }
    })
    .populate({
      path: 'replyComment',
      model: 'postComment'
    })
    .limit(limit)
    .skip(limit * (page - 1))
    .exec()
  const resArticle = []
  allComments.forEach((doc) => {
    resArticle.push(doc)
  })
  res.status(200).json(resArticle)
})

/**
 * Delete comment
 * @date 2020-05-09
 * @param {any} '/delete-comments'
 * @param {any} authorized
 * @param {any} req.query.commentId
 * @returns {any}
 */
router.delete('/delete-comments', authorized, async (req, res) => {
  try {
    const query = { _id: req.query.commentId }
    if (req.user.role !== 'admin') {
      query.commentor = req.user._id
    }
    const deletedComment = await PostComment.findOneAndDelete(query).exec()
    if (deletedComment) {
      if (deletedComment.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(deletedComment.cloudinaryId, {
            invalidate: true
          })
        } catch (err) {
          console.log('err', err)
        }
      }
      res.status(200).json({ deletedcomment: deletedComment })
    } else {
      res.status(400).json({ msg: 'Delete unsuccessful' })
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

router.put('/report-comment', authorized, async (req, res) => {
  try {
    const query = {
      _id: req.query.commentId,
      commentor: { $ne: req.user._id }
    }
    const user = req.user._id
    const doc = await PostComment.findOneAndUpdate(
      query,
      {
        $addToSet: { reportedBy: user }
      },
      {
        new: true
      }
    )
    if (doc) {
      res.status(200).json({ reportedComment: doc })
    } else {
      res.status(404).json({ msg: 'You cannot report your own comment' })
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

/**
 * Like / dislike post
 * @date 2020-05-09
 * @param {any} '/like'
 * @param {any} authorized
 * @param {any} req.query.articleId
 * @returns {any}
 */
router.get('/like', authorized, async (req, res) => {
  try {
    const query = { articleId: req.query.articleId, likedBy: req.user._id }

    const deleteLike = await LikeArticle.findOneAndDelete(query).exec()

    if (deleteLike) {
      res.status(200).json({ message: 'Unlike successfully' })
    } else {
      const article = new LikeArticle(query)
      await article.save((err, data) => {
        if (err) {
          res.status(400).json({ msg: err })
          return
        }
        res.status(200).json({ likeData: data })
      })
    }
  } catch (err) {
    res.status(400).json({ message: err })
  }
})

/**
 * Get Articles
 * @date 2020-05-04
 * @param {any} '/get-articles'
 * @param {String} categoryid
 * @param {String} limit
 * @param {String} page
 * @returns {any}
 */
router.get('/get-articles', async (req, res) => {
  try {
    const categoryPosts = req.query.categoryid
    const limit = Number(req.query.pageSize) || 30
    const page = Number(req.query.page) || 1
    let query = {}
    if (categoryPosts) {
      query = {
        categories: mongoose.Types.ObjectId(categoryPosts),
        isPublished: true,
        isVerified: true
      }
    } else {
      query = {
        isPublished: true,
        isVerified: true
      }
    }
    const allArticles = await Article.find(query)
      .populate('categories')
      .populate([{ path: 'likes' }])
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
      .sort({ createdDate: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .exec()
    const resArticle = []
    allArticles.forEach((doc) => {
      resArticle.push(doc.toObject())
    })
    const data = await Promise.all(
      resArticle.map((key) => {
        return getArticleArr(key).then((value) => {
          return value
        })
      })
    )
    res.status(200).json({ articles: data, pageSize: limit, page })
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

/**
 * For delete article
 * @date 2020-05-04
 * @param {any} '/delete-article'
 * @param {any} articleId
 * @returns {any}
 */
router.delete('/delete-article', authorized, async (req, res) => {
  try {
    const query = { _id: req.query.articleId }
    if (req.user.role !== 'admin') {
      query.author = req.user._id
    }
    const deleteArticle = await Article.findOneAndDelete(query).exec()
    if (deleteArticle) {
      if (deleteArticle[deleteArticle.articleType].cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(
            deleteArticle[deleteArticle.articleType].cloudinaryId,
            {
              invalidate: true
            }
          )
        } catch (err) {
          console.log('err', err)
        }
      }
      await PostComment.deleteMany({
        articleId: req.query.articleId
      }).exec()
      await LikeArticle.deleteMany({ articleId: req.query.articleId }).exec()
      clearHash(req.query.articleId)
      res
        .status(200)
        .json({ message: `${req.query.articleId} deleted successfully` })
    } else {
      res.status(400).json({ message: `Article not found` })
    }
  } catch (err) {
    res.status(400).json({ message: err })
  }
})

/**
 * Get single post
 * @date 2020-05-04
 * @param {any} '/single-article'
 * @param {any} articleid
 * @returns {any}
 */
router.get('/single-article', async (req, res) => {
  try {
    const articleid = req.query.articleid
    const article = await Article.findById({ _id: articleid, isVerified: true })
      .populate('categories')
      .populate({
        path: 'author',
        model: 'MultiAccountUser',
        select: { password: 0, permissions: 0 }
      })
      .populate([{ path: 'likes' }])
      .populate({
        path: 'categories',
        populate: {
          path: 'createdBy',
          model: 'MultiAccountUser',
          select: { password: 0, permissions: 0 }
        }
      })
    if (process.env.NODE_ENV === 'production') {
      client.incr(`storyViews_${articleid}`)
    }
    const articleObj = article.toObject()
    const value = await client.get(`storyViews_${articleid}`)
    const articleDetails = {
      ...articleObj,
      newViews: value ? Number(value) : 0
    }
    res.status(200).json(articleDetails)
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

/**
 * Get all categories
 * @date 2020-05-09
 * @param {any} '/categories'
 * @returns {any}
 */
router.get('/categories', async (req, res) => {
  try {
    const allCategories = await Category.find()
      .sort({ name: 1 })
      .cache({ expire: 60 * 60 * 24 })
    const categories = []
    allCategories.forEach((doc) => {
      categories.push(doc)
    })
    res.status(200).json(categories)
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

router.get('/search', async (req, res) => {
  try {
    const comment = req.query.comment
    const limit = Number(req.query.limit) || 30
    const page = Number(req.query.page) || 1
    const article = req.query.article
    let query = {}
    if (comment) {
      if (comment.includes('#')) {
        query = { hashtags: comment.match(/#\w+/g)[0].replace('#', '') }
      } else {
        query = { $text: { $search: comment } }
      }
    }
    if (article) {
      if (article.includes('#')) {
        query = { hashtags: article.match(/#\w+/g)[0].replace('#', '') }
      } else {
        query = { $text: { $search: article } }
      }
    }
    let searchResult = null
    if (comment) {
      searchResult = await PostComment.find(query)
        .populate({
          path: 'commentor',
          model: 'MultiAccountUser',
          select: { password: 0, permissions: 0 }
        })
        .populate({
          path: 'replyComment',
          model: 'postComment'
        })
        .sort({ createdDate: -1 })
        .limit(limit)
        .skip(limit * (page - 1))
        .exec()
      const resArticle = []
      searchResult.forEach((doc) => {
        resArticle.push(doc.toObject())
      })
      res.status(200).json({ result: resArticle, pageSize: limit, page })
    }
    if (article) {
      searchResult = await Article.find(query)
        .populate('categories')
        .populate([{ path: 'likes' }])
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
        .sort({ createdDate: -1 })
        .limit(limit)
        .skip(limit * (page - 1))
        .exec()
      const resArticle = []
      searchResult.forEach((doc) => {
        resArticle.push(doc.toObject())
      })
      const data = await Promise.all(
        resArticle.map((key) => {
          return getArticleArr(key).then((value) => {
            return value
          })
        })
      )
      res.status(200).json({ result: data, pageSize: limit, page })
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})

export default router
