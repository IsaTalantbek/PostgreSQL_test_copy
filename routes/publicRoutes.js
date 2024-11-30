import express from 'express'
import { redirectIfAuthenticated } from '../middleware/authMiddleware.js'
import authPageManager from './controllers/publicControllers/authPageManager.js'
import pageManager from './controllers/publicControllers/pageManager.js'
const router = express.Router()

router.get('/login', redirectIfAuthenticated, authPageManager('login'))

router.get('/reg', redirectIfAuthenticated, authPageManager('reg'))

router.get('/', pageManager('/main'))

export default router
