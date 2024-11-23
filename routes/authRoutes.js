import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { pool, run, fetchData, createData } from '../../project/index.js' // импортируй свой клиент подключения к PostgreSQL
dotenv.config()
const router = express.Router()

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET

// Регистрация
router.post('/reg', async (req, res) => {
    let { username, password } = req.body

    username = username.trim()
    password = password.trim()

    // Проверка на существование пользователя
    const userExists = await run(fetchData, username)
    if (userExists.rowCount > 0) {
        return res.status(400).json({ message: 'Пользователь уже существует' })
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10)

    // Сохранение пользователя в БД
    await run(createData, username, hashedPassword)

    res.status(201).json({ message: 'Регистрация успешна' })
})

// Логин
router.post('/login', async (req, res) => {
    let { username, password } = req.body

    username = username.trim()
    password = password.trim()

    const user = await run(fetchData, username)
    if (user.rowCount === 0) {
        return res.status(400).json({ message: 'Неверный логин или пароль' })
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password)
    if (!isMatch) {
        return res.status(400).json({ message: 'Неверный логин или пароль' })
    }

    // Создаем JWT токен
    const token = jwt.sign(
        {
            userId: user.rows[0].id,
            role: user.rows[0].role,
            username: user.rows[0].login,
        }, // Используем правильные данные
        JWT_SECRET,
        { expiresIn: '1h' }
    )
    res.cookie('token', token, {
        httpOnly: true, // Доступ к куке только через HTTP, не через JS
        secure: process.env.NODE_ENV === 'production', // Secure flag только в production (для HTTPS)
        maxAge: 3600000, // Срок действия куки 1 час (в миллисекундах)
    })

    res.status(200).json({ message: 'Авторизация успешна' })
})

router.get('/logout', (req, res) => {
    // Очистка куки с названием "token"
    res.clearCookie('token', { httpOnly: true, secure: true }) // Если ваш сайт использует HTTPS, добавьте secure: true
    res.status(200).json({ message: 'Вы вышли из системы' })
})

export default router
