import mongoose, { Schema } from 'mongoose'

const postComment = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'article',
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  textComment: {
    type: String
  },
  mediaUrl: {
    type: String
  },
  embedUrl: {
    type: String
  },
  commentor: {
    type: Schema.Types.ObjectId,
    ref: 'MultiAccountUser'
  }
})

const category = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  summary: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'MultiAccountUser'
  },
  canUserPost: {
    type: Boolean,
    default: false
  }
})

export const Category = mongoose.model('category', category)
export const PostComment = mongoose.model('postComment', postComment)
