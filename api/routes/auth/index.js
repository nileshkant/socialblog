import { Router } from 'express'
// import passport from 'passport'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import find from 'lodash/find'
import { SECRET } from '../../env'
import { MultiAccountUser } from './modal'

const router = Router()

/**
 * @name register - Register an account
 * @return {Object<{ username: string, message: string }>}
 *
 * @example POST /authentication/register { username: ${username}, password: ${password} }
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new MultiAccountUser({
      username,
      email,
      accounts: [{ password: passwordHash }]
    })
    await user.save()
    res.status(200).json({ username, message: 'Sign up suceesfully' })
  } catch (error) {
    res.status(400).json({ error })
  }
})

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
      const passwordsMatch = await bcrypt.compare(
        password,
        find(user.accounts, 'password').password
      )
      if (passwordsMatch) {
        const payload = {
          username: user.username,
          expires: Date.now() + 3 * 60 * 60 * 1000
        }

        req.login(payload, { session: false }, (error) => {
          if (error) res.status(400).json({ message: error })

          const token = jwt.sign(JSON.stringify(payload), SECRET)

          res.status(200).json({
            username: user.username,
            token,
            message: 'Sign in suceesfully'
          })
        })
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

export default router
