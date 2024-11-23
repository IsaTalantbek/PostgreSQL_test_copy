import express from 'express'
import { WebSocketServer } from 'ws'
import { pool } from './project/index.js' // Импортируем соединение с PostgreSQL
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import dataRoutes from './project/aa.js'
import authRoutes from './routes/authRoutes.js'
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
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
const app = express()
app.use(
    cors({
        origin: 'https://postgresql-test-copy.onrender.com', // Укажите домен клиента
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    })
)

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
app.get('/get-token', (req, res) => {
    const token = req.cookies.token // Извлекаем токен из куки
    if (token) {
        res.json({ token }) // Возвращаем токен клиенту
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
})

app.use('/api/database', authenticateToken, checkRole('admin'), dataRoutes)
app.use('/api/auth', authRoutes)
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

const wss = new WebSocketServer({ server })

const SECRET_KEY = process.env.JWT_SECRET

wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1])
    const token = params.get('token')

    let username = 'Аноним'

    if (token) {
        try {
            const payload = jwt.verify(token, SECRET_KEY)
            username = payload.username || 'Аноним'
        } catch (error) {
            console.error('Неверный токен:', error.message)
            ws.close(1008, 'Неверный токен')
            return
        }
    } else {
        console.error('Токен отсутствует')
        ws.close(1008, 'Токен обязателен')
        return
    }

    console.log(`Пользователь подключился: ${username}`)

    // Получаем все сообщения из базы данных
    pool.query(
        'SELECT username, data FROM messages ORDER BY timestamp ASC',
        (err, result) => {
            if (err) {
                console.error('Ошибка при получении сообщений:', err.message)
                return
            }

            // Отправляем все сообщения клиенту
            result.rows.forEach((message) => {
                ws.send(
                    JSON.stringify({
                        type: 'message',
                        username: message.username,
                        data: message.data,
                    })
                )
            })
        }
    )

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message)

            if (parsedMessage.type === 'message') {
                console.log(`Сообщение от ${username}: ${parsedMessage.data}`)

                // Сохраняем сообщение в базе данных
                pool.query(
                    'INSERT INTO messages (username, data) VALUES ($1, $2) RETURNING *',
                    [username, parsedMessage.data],
                    (err, result) => {
                        if (err) {
                            console.error(
                                'Ошибка при сохранении сообщения:',
                                err.message
                            )
                            return
                        }

                        // Отправляем сообщение всем клиентам
                        const chatMessage = {
                            username: result.rows[0].username,
                            data: result.rows[0].data,
                        }

                        // Рассылаем сообщение всем клиентам
                        wss.clients.forEach((client) => {
                            if (client.readyState === ws.OPEN) {
                                client.send(
                                    JSON.stringify({
                                        type: 'message',
                                        ...chatMessage,
                                    })
                                )
                            }
                        })
                    }
                )
            }
        } catch (error) {
            console.error('Ошибка обработки сообщения:', error.message)
        }
    })

    ws.on('close', () => {
        console.log(`Пользователь отключился: ${username}`)
    })
})
