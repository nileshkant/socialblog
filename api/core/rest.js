import { Router } from 'express'
import authentication from '../routes/auth/index'
// import blog from '~/blog/rest'

const router = Router()

router.get('/', (req, res) => {
  res.send('app-root')
})

// router.use('/hello-world', helloWorld);
// router.use('/crud-operations', crudOperations);
router.use('/authentication', authentication)
// router.use('/blog', blog)

export default router
