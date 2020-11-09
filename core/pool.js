const util = require("util")
const mysql = require("mysql")

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'paymentsite'
})

// Connect
pool.getConnection((err, connection) => {
    if(err) {
        throw err
    }
    if(connection)
        connection.release();
        console.log("MySql connected...")
    return;
})

pool.query = util.promisify(pool.query)

module.exports = pool

