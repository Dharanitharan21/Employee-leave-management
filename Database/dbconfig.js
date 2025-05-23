const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:process.env.PORT
});

pool.getConnection()
  .then(conn => {
    console.log("MySQL Connected");
    conn.release();
  })
  .catch(err => {
    console.error("MySQL connection failed:", err.message);
  });

module.exports = pool;
