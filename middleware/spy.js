export const spyMiddleware = (req, res, next) => {
    console.log('Path:', req.originalUrl)
    console.log('Headers:', req.headers.cookie)
    console.log('Body:', req.body)
    next()
}
