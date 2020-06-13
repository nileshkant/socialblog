import mongoose, { Schema } from 'mongoose'

const contactUs = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'MultiAccountUser' },
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
  contactNo: {
    type: String,
    required: true,
    minlength: 7,
    trim: true
  },
  reason: {
    type: String,
    required: true,
    minlength: 5,
    trim: true
  },
  message: {
    type: String,
    required: true,
    minlength: 50,
    trim: true
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'MultiAccountUser'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export const ContactUs = mongoose.model('contactUs', contactUs)
