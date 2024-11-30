import { pool } from '../../../project/index.js'

const deleteMessagesController = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM messages')
        res.status(200).json({ message: 'All message deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error deleting users' })
    }
}

export default deleteMessagesController
