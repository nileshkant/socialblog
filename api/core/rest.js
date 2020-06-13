import { Router } from 'express'
import authentication from '../routes/auth/index'
import uploadFile from '../routes/uploadFile'
import article from '../routes/article'
import weather from '../routes/weather'
import covid19 from '../routes/covid19'
import userProfile from '../routes/userProfile'
import noembed from '../routes/noembed'
import contactUs from '../routes/contactUs'

// import blog from '~/blog/rest'

const router = Router()

router.get('/', (req, res) => {
  res.send('app-root')
})

// router.use('/hello-world', helloWorld);
// router.use('/crud-operations', crudOperations);
router.use('/authentication', authentication)
router.use('/upload-file', uploadFile)
router.use('/article', article)
router.use('/weather', weather)
router.use('/covid19', covid19)
router.use('/user-profile', userProfile)
router.use('/noembed', noembed)
router.use('/contact-us', contactUs)

export default router
