import {
    run,
    createData,
    fetchData,
    updateData,
    deleteData,
    pool,
} from './index.js'
import { Router } from 'express'

const dataRouter = Router()

dataRouter.post('/', async (req, res) => {
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
})

dataRouter.get('/', async (req, res) => {
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
})

dataRouter.put('/', async (req, res) => {
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
})

dataRouter.delete('/:id', async (req, res) => {
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
})

dataRouter.get('/delete', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM messages')
        res.status(200).json({ message: 'All users deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error deleting users' })
    }
})

export default dataRouter
