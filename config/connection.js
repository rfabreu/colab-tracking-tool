const mysql = require('mysql2');
require("dotenv").config();

const db = mysql.createConnection(
    {
        host: process.env.MYSQL_HOST,
        // MySQL username
        user: process.env.MYSQL_USERNAME,
        // MySQL password
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DBNAME
    },
    console.log('Connected to the management database.')
);

module.exports = db;