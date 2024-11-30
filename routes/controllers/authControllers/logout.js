const logoutController = (req, res) => {
    // Очистка куки с названием "token"
    res.clearCookie('token', { httpOnly: true, secure: true }) // Если ваш сайт использует HTTPS, добавьте secure: true
    res.status(200).json({ message: 'Вы вышли из системы' })
}

export default logoutController
