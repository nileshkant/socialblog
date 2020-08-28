import mongoose, { Schema } from 'mongoose'

const userAdditionalDetails = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'MultiAccountUser' },
  coinBalance: {
    type: Number,
    min: 0,
    default: 20
  },
  redeemedBalance: [
    {
      action: String,
      actionDate: Date,
      amount: Number
    }
  ],
  followers: [{ type: Schema.Types.ObjectId, ref: 'MultiAccountUser' }],
  followings: [{ type: Schema.Types.ObjectId, ref: 'MultiAccountUser' }],
  profileDetails: {
    gender: String,
    bio: String,
    website: String
  }
})

export const UserAdditionalDetails = mongoose.model(
  'userAdditionalDetails',
  userAdditionalDetails
)
