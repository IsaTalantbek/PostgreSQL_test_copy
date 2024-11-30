import { run, fetchData } from '../../../project/index.js'

const getController = async (req, res) => {
    try {
        const { username, id } = req.query // Используем req.query для GET параметров
        const result = await run(fetchData, username, id)
        res.status(200).json(result.rows) // Отправляем результат в формате JSON
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ error: 'fetch-500-error' }) // Ответ в формате JSON
        }
        console.error(err.stack)
    }
}

export default getController
