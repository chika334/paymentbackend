// lib/db.js

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'paymentsite',
  password: ''
  //user: 'mipplePayment',
  //password: 'mipplepay123@'
});

// Connect
connection.connect((err) => {
    if(err) throw err
    console.log("MySql connected...")
})

//pool.query = util.promisify(pool.query)

//module.exports = pool


//connection.connect();
module.exports = connection;
