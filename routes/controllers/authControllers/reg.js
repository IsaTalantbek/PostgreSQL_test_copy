import { run, fetchData, createData } from '../../../project/index.js'
import bcrypt from 'bcryptjs'

const regAuthController = async (req, res) => {
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
}

export default regAuthController
