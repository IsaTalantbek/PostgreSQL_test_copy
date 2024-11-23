import express from 'express'
import path from 'path'
import {
    authenticateToken,
    checkRole,
} from '../../middleware/authMiddleware.js'
const router = express.Router()
const __dirname = path.resolve()

router.get('/main', authenticateToken, (req, res) => {
    const filePath = path.join(process.cwd(), 'protected', 'index.html')
    console.log('File path:', filePath) // Для отладки
    res.sendFile(filePath)
})

router.get(
    '/admin-panel',
    authenticateToken,
    checkRole('admin'),
    (req, res) => {
        res.sendFile(path.join(__dirname, 'protected', 'admin.html'))
    }
)

export default router
