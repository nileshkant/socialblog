export const RATE_LIMIT = process.env.RATE_LIMIT
export const SENTRY_DNS = process.env.SENTRY_DNS

export const SECRET = process.env.SECRET

export const MONGODB_URI = process.env.MONGODB_URI

export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
export const TOKEN_EXPIRE_TIME =
  process.env.TOKEN_EXPIRE_TIME || Date.now() + 3 * 60 * 60 * 1000

export const REFRESH_TOKEN_EXPIRE_TIME =
  process.env.REFRESH_TOKEN_EXPIRE_TIME || Date.now() + 30 * 24 * 60 * 60 * 1000

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
