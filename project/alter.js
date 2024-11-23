const alterData = async (client, verify) => {
    const addColumnQuery = `
        ALTER TABLE clients 
        ADD COLUMN IF NOT EXISTS Verify BOOLEAN DEFAULT false;
    `
    const updateVerifyQuery = `
        UPDATE clients
        SET Verify = $1
        WHERE Verify IS NULL;
    `
    try {
        await client.query(addColumnQuery)
        console.log('Column "Verify" added successfully (if it did not exist)')

        await client.query(updateVerifyQuery, [verify])
        console.log('All NULL Verify fields updated to:', verify)

        await checkTableData()
    } catch (err) {
        console.error('Error altering table', err.stack)
    }
}

export default alterData
