import mongoose, { Schema } from 'mongoose'

const postComment = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'article'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  editedDate: {
    type: Date
  },
  textMessage: {
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

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return /^.{6,}$/i.test(value)
      },
      message: () => `minimum 6 charater required`
    }
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'category'
    }
  ],
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MultiAccountUser'
    }
  ],
  subtitle: {
    type: String,
    validate: {
      validator(value) {
        return /^.{6,}$/i.test(value)
      },
      message: () => `minimum 6 charater required`
    }
  },
  author: { type: Schema.Types.ObjectId, ref: 'MultiAccountUser' },
  articleBody: {
    type: String,
    validate: {
      validator(value) {
        return /^.{6,}$/i.test(value)
      },
      message: () => `minimum 6 charater required`
    }
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  mediaUrl: {
    type: String
  },
  embedUrl: {
    type: String
  },
  source: {
    type: String
  },
  articleType: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: true
  }
})

export const Category = mongoose.model('category', category)
export const Article = mongoose.model('article', articleSchema)
export const PostComment = mongoose.model('postComment', postComment)
