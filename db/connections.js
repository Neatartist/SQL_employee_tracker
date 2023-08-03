const mysql = require('mysql2');

require('dotenv').config()

// connect to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
  console.log("successful connection!")
);

module.exports = db;