import { run, deleteData } from '../../../project/index.js'

const deleteController = async (req, res) => {
    try {
        const { id } = req.params
        const log = await run(deleteData, id)
        if (!log) {
            res.status(500).json({ message: 'delete-404', log: log })
        }
        res.status(200).json({ message: 'delete-200', id: log }) // Используйте .json(), чтобы вернуть JSON
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).send('delete-500-error')
        }
        console.error(err.stack)
    }
}

export default deleteController
