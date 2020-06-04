import mongoose, { Schema } from 'mongoose'

const userMultiAccountSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator(value) {
        return /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/i.test(
          value
        )
      },
      message: ({ value }) => `${value} is not a valid`
    }
  },
  email: {
    type: String,
    validate: {
      validator(value) {
        return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
          value
        )
      },
      message: ({ value }) => `${value} is not a valid email format`
    }
  },
  accountCreatedDate: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String
  },

  gender: {
    type: String
  },

  facebook: {
    id: { type: String },
    profilePic: { type: String },
    displayName: { type: String },
    email: { type: String },
    gender: { type: String }
  },

  google: {
    id: { type: String }
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'moderator'
  },
  permissions: [
    {
      route: String,
      operations: {
        type: [String],
        enum: ['create', 'read', 'update', 'delete']
      }
    }
  ]
})

export const MultiAccountUser = mongoose.model(
  'MultiAccountUser',
  userMultiAccountSchema
)
