import { Router } from 'express'
import passport from 'passport'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import omit from 'lodash/omit'
import { SECRET, REFRESH_TOKEN_SECRET } from '../../env'
import { authorized } from '../../utils'
import { MultiAccountUser } from './modal'

const router = Router()

const jwtLogin = (req, res, user, social) => {
  const userDetails = omit(user, ['password'])
  const payload = {
    userDetails,
    expires: Date.now() + 3 * 60 * 60 * 1000
  }
  req.login(payload, { session: false }, (error) => {
    if (error) res.status(400).json({ message: error })

    const token = jwt.sign(JSON.stringify(payload), SECRET)
    const refreshToken = jwt.sign(
      JSON.stringify({
        ...payload,
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000
      }),
      REFRESH_TOKEN_SECRET
    )
    const jsonRes = {
      userDetails,
      token,
      refreshToken
    }
    if (social) {
      res.redirect(
        `${process.env.BASE_URL}/callback?res=${JSON.stringify(jsonRes)}`
      )
      return
    }
    res.status(200).json(jsonRes)
  })
}

/**
 * @name register - Register an account
 * @return {Object<{ username: string, message: string }>}
 *
 * @example POST /authentication/register { username: ${username}, password: ${password} }
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !password || !email) {
    res.status(400).json({ message: 'Please provide valid details' })
  }

  const user = await MultiAccountUser.findOne({ email }).lean()
  if (user && user.email) {
    res.status(400).json({ message: 'User already exist' })
    return
  }
  if (user && user.username) {
    res.status(400).json({ message: 'Username already exist' })
    return
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new MultiAccountUser({
      username,
      email,
      password: passwordHash
    })
    await user.save()
    res.status(200).json({ username, message: 'Sign up suceesfully' })
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get('/auth/facebook', passport.authenticate('facebook'))

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: process.env.BASE_URL
  }),
  (req, res) => {
    jwtLogin(req, res, req.user, true)
  }
)

/**
 * @name login - get user token
 * @return {Object<{ username: string, token: string, message: string }>}
 *
 * @example POST /authentication/login { username: ${username}, password: ${password} }
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await MultiAccountUser.findOne({ username }).lean()
    if (password) {
      const passwordsMatch = await bcrypt.compare(password, user.password)
      if (passwordsMatch) {
        jwtLogin(req, res, user)
      } else {
        res.status(400).json({ message: 'Incorrect Username / Password' })
      }
    } else {
      res.status(400).json({ message: 'Incorrect Username / Password' })
    }
  } catch (error) {
    res.status(400).json({ message: error })
  }
})

router.get('/profile', authorized, async (req, res) => {
  try {
    const { user } = await req
    res.status(200).json(omit(user, ['password']))
  } catch (err) {
    res.send(400, err)
  }
})

router.post('/getToken', async (req, res) => {
  try {
    const { refreshToken } = req.body
    const tokenData = await jwt.decode(refreshToken, REFRESH_TOKEN_SECRET)
    if (Date.now() > tokenData.expires)
      return res.status(401).json({ message: 'invalid token' })
    const newToken = jwt.sign(
      JSON.stringify({
        ...tokenData,
        expires: Date.now() + 3 * 60 * 60 * 1000
      }),
      SECRET
    )
    res.status(200).json({ token: newToken })
  } catch (err) {
    res.send(400, err)
  }
})

export default router
