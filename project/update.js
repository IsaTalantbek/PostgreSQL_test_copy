const checkColumn = ['login', 'password', 'email']

const updateData = async (client, column, value, id) => {
    if (!checkColumn.includes(column)) {
        throw new Error('Invalid column name')
    }
    const query = `
    UPDATE users
    SET ${column} = $1
    WHERE id = $2
`
    const values = [value, id]
    try {
        await client.query(query, values)
        return id
    } catch (err) {
        console.error('Error updating data', err.stack)
        throw err
    }
}

export default updateData
