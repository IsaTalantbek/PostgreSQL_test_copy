import express from 'express'
import path from 'path'
import { redirectIfAuthenticated } from '../middleware/authMiddleware.js'
const router = express.Router()
const __dirname = path.resolve()

router.use(
    '/.well-known/acme-challenge',
    express.static(
        path.join(__dirname, 'public', '.well-known', 'acme-challenge')
    )
)

router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'authPublic', 'login.html'))
})

router.get('/reg', redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'authPublic', 'reg.html'))
})

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'))
})

export default router
