const createData = async (client, login, password, email = null) => {
    const values = 

    try {
        const checkRes = await client.query(query, values)

        if (checkRes.rows.length > 0) {
            const existingLogin = checkRes.rows.find(
                (user) => user.login === login
            )
            const existingEmail = email
                ? checkRes.rows.find((user) => user.email === email)
                : null

            if (existingLogin && existingEmail) {
                throw new Error('Error: login and email already exist')
            } else if (existingEmail) {
                throw new Error('Error: email already exist')
            } else if (existingLogin) {
                throw new Error('Error: login already exist')
            }
        }

        const insertQuery = email
            ? `INSERT INTO users (login, password, email) VALUES ($1, $2, $3) RETURNING id;`
            : `INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id;`
        const insertValues = email
            ? [login, password, email]
            : [login, password]

        const res = await client.query(insertQuery, insertValues)

        console.log('Data inserted successfully:', res.rowCount)
        return res.rows[0].id
    } catch (err) {
        console.error('Error inserting data:', err.stack)
        throw err
    }
}

export default createData
