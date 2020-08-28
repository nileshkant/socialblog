import { Router } from 'express'
import { authorized } from '../../utils'
import { UserAdditionalDetails } from './modal'

const router = Router()

router.get('/get-additional-details', authorized, async (req, res) => {
  try {
    const additionalDetails = await UserAdditionalDetails.findOne({
      userId: req.user._id
    })
    res.status(200).json(additionalDetails)
  } catch (err) {
    res.status(200).json({ msg: err })
  }
})

export default router
