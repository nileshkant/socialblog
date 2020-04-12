import fs from 'fs'
import { Router } from 'express'
import multer from 'multer'
import passport from 'passport'
import cloudinary from '../../core/cloudinary'
const upload = multer({ dest: 'uploads/' })

const router = Router()

router.post(
  '/image',
  passport.authenticate('jwt', { session: false }),
  upload.single('postImage'),
  async (req, res) => {
    await cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) {
        res.status(400).json({ message: 'Oops! not able to upload.' })
        return error
      }
      fs.unlink(req.file.path, function(err) {
        if (err) throw err
      })
      res.status(200).json({ url: result.url, public_id: result.public_id })
    })
  }
)

export default router
