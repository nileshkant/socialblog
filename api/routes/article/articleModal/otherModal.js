import mongoose, { Schema } from 'mongoose'

const likeArticle = new Schema({
  likedBy: { type: Schema.Types.ObjectId, ref: 'MultiAccountUser' },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'article',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const bookmarkArticle = new Schema({
  bookmarkedBy: { type: Schema.Types.ObjectId, ref: 'MultiAccountUser' },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'article',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export const LikeArticle = mongoose.model('likeArticle', likeArticle)
export const BookmarkArticle = mongoose.model(
  'bookmarkArticle',
  bookmarkArticle
)
