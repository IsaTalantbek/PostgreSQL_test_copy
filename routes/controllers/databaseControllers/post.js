import { createData, run } from '../../../project/index.js'

const postController = async (req, res) => {
    try {
        const result = req.body
        const params = Object.values(result)
        const log = await run(createData, ...params)
        res.status(200).json({ message: 'create-200', id: log }) // Ответ в формате JSON
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ error: 'create-500-error' }) // Ответ в формате JSON
        }
        console.error(err.stack)
    }
}

export default postController
