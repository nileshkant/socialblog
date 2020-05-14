import { Router } from 'express'
import authentication from '../routes/auth/index'
import uploadFile from '../routes/uploadFile'
import article from '../routes/article'
import weather from '../routes/weather'

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

export default router
