// db.js

const mysql = require("mysql2");
const fs = require("fs");
require("dotenv").config();

const caPath = process.env.CA;
if (!caPath) {
  console.error("❌ Missing CA file path in environment variables (CA=...)");
  process.exit(1);
}

const pool = mysql.createPool({
  connectionLimit: 10, // adjust as needed
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: {
    ca: fs.readFileSync(caPath),
  },
});

module.exports = pool.promise(); // Optional: promise wrapper
