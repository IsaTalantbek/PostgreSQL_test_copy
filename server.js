import express from 'express'
import { WebSocketServer } from 'ws'
import { pool } from './project/index.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import dataRoutes from './routes/dbRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import protectRoutes from './routes/protectedRoutes.js'
import {
    authenticateToken,
    checkRole,
    redirectIfAuthenticated,
} from './middleware/authMiddleware.js'
import { fileURLToPath } from 'url'
import { run, fetchData } from './project/index.js'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.js'
import { spyMiddleware } from './middleware/spy.js'
import { createWebSocketServer } from './webSocket/webSocketServer.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
const app = express()
app.use(cors())

console.log(process.env.PORT)

app.use(express.json())
app.use(cookieParser())
// Шпион
app.use(spyMiddleware)

app.use(errorHandler)

app.use(express.static(path.join(__dirname, 'public')))
app.use(
    '/protected',
    authenticateToken,
    express.static(path.join(__dirname, 'protected'))
)

app.use('/', publicRoutes)

app.use('/a', protectRoutes)

app.get('/test-token', authenticateToken, (req, res) => {
    res.json({ user: req.user })
})
app.use('/api', apiRoutes)

app.get('/get-token', (req, res) => {
    const token = req.cookies.token // Извлекаем токен из куки
    if (token) {
        res.json({ token }) // Возвращаем токен клиенту
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
})

app.get('/config', (req, res) => {
    console.log('Port:', process.env.PORT) // Выводим порт в консоль
    res.json({
        port: process.env.PORT,
    })
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'))
})
const server = app.listen(process.env.PORT, '0.0.0.0', () =>
    console.log('server starting')
)

const wss = createWebSocketServer(server)
