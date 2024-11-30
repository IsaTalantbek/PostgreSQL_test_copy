import path from 'path'

const __dirname = path.resolve()

const mainController = (req, res) => {
    res.sendFile(path.join(__dirname, 'protected', 'main.html'))
}
export default mainController
