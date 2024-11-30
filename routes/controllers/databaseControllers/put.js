import { updateData, run } from '../../../project/index.js'

const putController = async (req, res) => {
    try {
        const result = req.body
        const params = Object.values(result)
        const log = await run(updateData, ...params)
        res.status(200).json({
            message: 'update-200',
            id: log,
        }) // Ответ в формате JSON
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ error: 'update-500-error' }) // Ответ в формате JSON
        }
        console.error(err.stack)
    }
}

export default putController
