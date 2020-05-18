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
    type: String,
    index: true
  },
  mediaUrl: {
    type: String
  },
  embedUrl: {
    type: String
  },
  replyComment: {
    type: Schema.Types.ObjectId,
    ref: 'postComment'
  },
  reportedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MultiAccountUser'
    }
  ],
  commentor: {
    type: Schema.Types.ObjectId,
    ref: 'MultiAccountUser'
  },
  hashtags: [{ type: String }]
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
postComment.index({ textComment: 'text' })

export const Category = mongoose.model('category', category)
export const PostComment = mongoose.model('postComment', postComment)
