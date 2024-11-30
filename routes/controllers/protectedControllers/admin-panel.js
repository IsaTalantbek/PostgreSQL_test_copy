import path from 'path'

const __dirname = path.resolve()

const adminController = (req, res) => {
    res.sendFile(path.join(__dirname, 'protected', 'admin.html'))
}
export default adminController
