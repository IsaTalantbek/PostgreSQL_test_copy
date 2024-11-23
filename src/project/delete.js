const deleteData = async (client, id) => {
    const query = `DELETE FROM users WHERE id = $1`
    const value = [id]
    try {
        const res = await client.query(query, value)
        if (res.rowCount === 0) {
            return undefined
        }
        return id
    } catch (err) {
        console.error(err.stack)
        throw err
    }
}

export default deleteData
