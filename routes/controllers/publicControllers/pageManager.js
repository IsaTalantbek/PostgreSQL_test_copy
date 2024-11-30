import path from 'path'

const __dirname = path.resolve()

const pageManager = (pageName) => (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${pageName}.html`))
}

export default pageManager
