import path from 'path'

const __dirname = path.resolve()

const authPageManager = (pageName) => (req, res) => {
    res.sendFile(path.join(__dirname, 'authPublic', `${pageName}.html`))
}

export default authPageManager
