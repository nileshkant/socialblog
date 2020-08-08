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
    enum: ['fullDetailsCard', 'quoteCard', 'movieReviewCard'],
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
  hashtags: [{ type: String }],
  views: {
    type: Number,
    default: 0
  },
  // All Card types according to post
  // Full details Card
  fullDetailsCard: {
    title: {
      type: String,
      min: [5, 'Minimum 5 charaters required'],
      unique: true,
      sparse: true
    },
    subtitle: {
      type: String,
      min: [5, 'Minimum 5 charaters required'],
      index: true
    },
    articleBody: {
      type: String,
      min: [5, 'Minimum 5 charaters required'],
      index: true
    },
    isMarkdown: {
      type: Boolean
    },
    mediaUrl: {
      type: String
    },
    cloudinaryId: {
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
      min: [5, 'Minimum 5 charaters required'],
      unique: true,
      sparse: true
    },
    quote: {
      type: String,
      min: [5, 'Minimum 5 charaters required'],
      index: true
    },
    isMarkdown: {
      type: Boolean
    },
    mediaUrls: [
      {
        type: String
      }
    ],
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
  },

  // Movie/Series Details card
  movieReviewCard: {
    Title: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    Year: {
      type: String
    },
    Rated: {
      type: String
    },
    Released: {
      type: String
    },
    Runtime: {
      type: String
    },
    Genre: {
      type: String
    },
    Director: {
      type: String
    },
    Writer: {
      type: String
    },
    Actors: {
      type: String
    },
    Plot: {
      type: String
    },
    Language: {
      type: String
    },
    Country: {
      type: String
    },
    Awards: {
      type: String
    },
    Poster: {
      type: String
    },
    TOSRating: {
      type: Number
    },
    Ratings: {
      type: [
        {
          Source: {
            type: String
          },
          Value: {
            type: String
          }
        }
      ]
    },
    Metascore: {
      type: String
    },
    imdbRating: {
      type: String
    },
    imdbVotes: {
      type: String
    },
    imdbID: {
      type: String
    },
    Type: {
      type: String
    },
    Production: {
      type: String
    }
  }
})

articleSchema.index({
  'fullDetailsCard.title': 1,
  'fullDetailsCard.subtitle': 1,
  'fullDetailsCard.articleBody': 1,
  'quoteCard.title': 1,
  'quoteCard.quote': 1,
  'movieReviewCard.Title': 1
})
articleSchema.index({
  'fullDetailsCard.title': 'text',
  'fullDetailsCard.subtitle': 'text',
  'fullDetailsCard.articleBody': 'text',
  'quoteCard.title': 'text',
  'quoteCard.quote': 'text',
  'movieReviewCard.Title': 'text'
})

// This is for joining two documents which has something in common in both

articleSchema.virtual('likes', {
  ref: 'likeArticle',
  localField: '_id', // this schema reference that is matching to foreignField
  foreignField: 'articleId' // this schema reference to ref field which is matching to this schema
})

articleSchema.set('toObject', { virtuals: true })
articleSchema.set('toJSON', { virtuals: true })

export const Article = mongoose.model('article', articleSchema)
