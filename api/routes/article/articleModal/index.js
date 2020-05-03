import mongoose, { Schema } from 'mongoose'

const articleSchema = new Schema({
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'category'
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

// This is for joining two documents which has something in common in both

articleSchema.virtual('likesCount', {
  ref: 'likeArticle',
  localField: '_id', // this schema reference that is matching to foreignField
  foreignField: 'articleId' // this schema reference to ref field which is matching to this schema
})

articleSchema.set('toObject', { virtuals: true })
articleSchema.set('toJSON', { virtuals: true })

export const Article = mongoose.model('article', articleSchema)
