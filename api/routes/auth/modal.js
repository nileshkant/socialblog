import mongoose, { Schema } from 'mongoose'

// const accountType = new Schema({
//   kind: {
//     type: String,
//     enum: ['internal', 'google', 'facebook'],
//     default: 'internal'
//   },
//   uid: {
//     type: String,
//     required() {
//       return this.kind !== 'internal'
//     }
//   },
//   password: {
//     type: String,
//     required() {
//       return this.kind === 'internal'
//     }
//   }
// })

const userMultiAccountSchema = new Schema({
  username: {
    type: String
    // required: true,
    // unique() {
    //   return !this.facebook.id || !this.googleId
    // }
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
    // required: true,
    // unique() {
    //   return !this.facebook.id || !this.googleId
    // }
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
    displayName: { type: String }
  },

  googleId: {
    type: String
  },
  //   accounts: [accountType],
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
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
