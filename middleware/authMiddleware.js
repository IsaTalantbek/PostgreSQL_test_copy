import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()
const errorPagePath = path.join(process.cwd(), 'public', 'login-error.html')
const errorPage = path.join(process.cwd(), 'public', 'error.html')

const JWT_SECRET = process.env.JWT_SECRET

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        console.log('No token provided')
        fs.readFile(errorPagePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Ошибка чтения файла:', err)
                return res.status(500).send('Internal Server Error')
            }
            if (!res.headersSent) {
                return res.status(401).send(data) // Возвращаем HTML-страницу с ошибкой
            }
        })
        return // После отправки ответа прерываем выполнение middleware
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message)
            return res.sendStatus(403) // Ошибка токена
        }
        console.log(user)
        req.user = user
        next() // Продолжаем выполнение, если авторизация прошла успешно
    })
}

export const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.sendStatus(403) // Если нет пользователя, отправляем ошибку
        }
        if (req.user.role !== role) {
            // Если роль пользователя не соответствует ожидаемой, отправляем страницу ошибки
            return res.sendFile(errorPage) // Путь к странице ошибки
        }
        next() // Продолжаем выполнение, если роль соответствует
    }
}

export const redirectIfAuthenticated = (req, res, next) => {
    const token = req.cookies.token // Читаем токен из куки

    if (token) {
        // Если токен есть, проверяем его валидность
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                // Если токен не валиден, продолжаем выполнение
                return next()
            }

            // Если токен валиден, перенаправляем на профиль
            return res.redirect('/a/main')
        })
    } else {
        // Если токена нет, продолжаем выполнение (пользователь может войти)
        next()
    }
}
