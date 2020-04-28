import mongoose, { Schema } from 'mongoose'

const articleSchema = new Schema({
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
  author: { type: Schema.Types.ObjectId, ref: 'MultiAccountUser' },
  createdDate: {
    type: Date,
    default: Date.now
  },
  articleType: {
    type: String,
    enum: ['fullDetailsCard', 'quoteCard'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },

  // All Card types according to post
  // Full details Card
  fullDetailsCard: {
    title: {
      type: String,
      unique: true,
      min: [5, 'Minimum 5 charaters required']
    },
    subtitle: {
      type: String,
      min: [5, 'Minimum 5 charaters required']
    },
    articleBody: {
      type: String,
      min: [5, 'Minimum 5 charaters required']
    },
    mediaUrl: {
      type: String
    },
    embedUrl: {
      type: String
    },
    source: {
      type: String
    }
  },

  // Quote card
  quoteCard: {
    title: {
      type: String,
      unique: true,
      min: [5, 'Minimum 5 charaters required']
    },
    quote: {
      type: String,
      min: [5, 'Minimum 5 charaters required']
    },
    color: {
      type: String,
      validate: {
        validator(value) {
          return /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^)]*\)/i.test(
            value
          )
        },
        message: () => `Not a valid color`
      }
    },
    source: {
      type: String
    }
  }
})

export const Article = mongoose.model('article', articleSchema)
