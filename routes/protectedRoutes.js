import { Router } from 'express'
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js'
import mainController from './controllers/protectedControllers/main.js'
import adminController from './controllers/protectedControllers/admin-panel.js'

const router = Router()

router.get('/main', authenticateToken, mainController)

router.get(
    '/admin-panel',
    authenticateToken,
    checkRole('admin'),
    adminController
)

export default router
