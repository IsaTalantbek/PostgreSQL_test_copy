import { Router } from 'express'
import authRouter from './authRoutes.js'
import dataRouter from './dbRoutes.js'
import { checkRole, authenticateToken } from '../middleware/authMiddleware.js'

const router = Router()

router.use('/auth', authRouter)

router.use('/database', authenticateToken, checkRole('admin'), dataRouter)

export default router
