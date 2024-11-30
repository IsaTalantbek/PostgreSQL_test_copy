import { WebSocketServer } from 'ws' // Изменен способ импорта
import jwt from 'jsonwebtoken'
import { pool } from '../project/index.js' // Подключите ваш пул для работы с базой данных

const SECRET_KEY = process.env.JWT_SECRET

export function createWebSocketServer(server) {
    const wss = new WebSocketServer({ server }) // Теперь WebSocketServer правильно используется

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
                    console.error(
                        'Ошибка при получении сообщений:',
                        err.message
                    )
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
                    console.log(
                        `Сообщение от ${username}: ${parsedMessage.data}`
                    )

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

    return wss
}
