import { Router } from 'express'
import { ContactUs } from './modal'
const router = Router()

router.post('/post-message', async (req, res) => {
  try {
    const { email, userId, contactNo, ...restfield } = req.body
    if (!(email || userId)) throw new Error('Please enter valid fields')
    const contact = new ContactUs({
      ...restfield,
      contactNo: String(contactNo)
    })
    if (email) {
      contact.email = email
    }
    if (userId) {
      contact.userId = userId
    }
    const contacted = await contact.save()
    if (contacted) {
      res.status(200).json({ msg: 'Form successfully saved' })
    }
  } catch (err) {
    res.status(400).json({ msg: err })
  }
})
export default router
