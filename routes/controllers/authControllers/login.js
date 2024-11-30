import { run, fetchData } from '../../../project/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

const loginAuthController = async (req, res) => {
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
}

export default loginAuthController
