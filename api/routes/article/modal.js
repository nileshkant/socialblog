import mongoose, { Schema } from 'mongoose'
const category = new Schema({
  name: { type: String, required: true },
  createdDate: {
    type: Date,
    default: Date.now
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'MultiAccountUser' },
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
  categories: [{ type: Schema.Types.ObjectId, ref: 'category' }],
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'MultiAccountUser' }],
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
  titleImage: {
    type: String
  },
  titleImageCaption: {
    type: String
  },
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
  file: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  }
})

export const Category = mongoose.model('category', category)
export const Article = mongoose.model('article', articleSchema)
