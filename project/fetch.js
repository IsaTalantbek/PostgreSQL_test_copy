const fetchData = async (client, username, id) => {
    console.log(username, id)
    let query
    let values

    try {
        if (!username && !id) {
            query = 'SELECT * FROM users'
        } else if (!username) {
            query = 'SELECT * FROM users WHERE id = $1'
            values = [id]
        } else {
            query = 'SELECT * FROM users WHERE login = $1'
            values = [username]
        }

        const res = await client.query(query, values)
        if (!res) {
            return 'this user is not exist'
        }
        return res // возвращаем только строки данных
    } catch (err) {
        console.error('Error fetching data', err.stack)
        throw new Error('Error fetching data') // выбрасываем ошибку для дальнейшей обработки
    }
}

export default fetchData
