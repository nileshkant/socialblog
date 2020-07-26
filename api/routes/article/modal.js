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
  cloudinaryId: {
    type: String
  },
  embedUrl: {
    title: {
      type: String
    },
    canonical: {
      type: String
    },
    description: {
      type: String
    },
    og_title: {
      type: String
    },
    og_url: {
      type: String
    },
    og_img: {
      type: String
    },
    og_type: {
      type: String
    },
    og_video: {
      type: String
    },
    og_description: {
      type: String
    },
    twitter_site: {
      type: String
    },
    twitter_domain: {
      type: String
    },
    twitter_img_src: {
      type: String
    },
    fb_appid: {
      type: String
    },
    fb_pages: {
      type: String
    },
    embedJson: {
      html: {
        type: String
      },
      version: {
        type: String
      },
      provider_url: {
        type: String
      },
      thumbnail_height: {
        type: Number
      },
      type: {
        type: String
      },
      author_url: {
        type: String
      },
      height: {
        type: Number
      },
      thumbnail_url: {
        type: String
      },
      thumbnail_width: {
        type: Number
      },
      author_name: {
        type: String
      },
      title: {
        type: String
      },
      url: {
        type: String
      },
      provider_name: {
        type: String
      },
      width: {
        type: Number
      },
      media_url: {
        type: String
      }
    }
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
