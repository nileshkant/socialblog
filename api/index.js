import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'
import * as Sentry from '@sentry/node'
import bodyParser from 'body-parser'
import routes from './core/rest'
import { RATE_LIMIT, SENTRY_DNS } from './env'
import passport from './core/passport'
import './core/mongoose'
import './core/redis'
const app = express()
if (process.env.NODE_ENV === 'production') Sentry.init({ dsn: SENTRY_DNS })

/**
 * @name middleware-functions
 */
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(helmet())
app.use(cors())
app.use(rateLimit({ max: Number(RATE_LIMIT), windowMs: 15 * 60 * 1000 }))
app.use(compression())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())
app.disable('etag')
if (process.env.NODE_ENV === 'production')
  app.use(Sentry.Handlers.requestHandler())

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!')
})

// Import API Routes
app.use('/', routes)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
