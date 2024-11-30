import { Router } from 'express'
import regAuthController from './controllers/authControllers/reg.js'
import loginAuthController from './controllers/authControllers/login.js'
import logoutController from './controllers/authControllers/logout.js'

const router = Router()

// Регистрация
router.post('/reg', regAuthController)
// Логин
router.post('/login', loginAuthController)

router.get('/logout', logoutController)

export default router
