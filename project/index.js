import pkg from 'pg'
import createData from './create.js'
import fetchData from './fetch.js'
import alterData from './alter.js'
import updateData from './update.js'
import deleteData from './delete.js'
import dotenv from 'dotenv'

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

const run = async (func, ...params) => {
    const client = await pool.connect()
    try {
        const result = await func(client, ...params)
        return result
    } catch (err) {
        console.log(err)
        throw err
    } finally {
        client.release()
    }
}

export { run, createData, fetchData, updateData, deleteData, pool }
