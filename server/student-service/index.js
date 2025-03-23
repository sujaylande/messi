const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const db = require("./config/db.js");
const studentRoutes = require('./routes/student.js');
const { connectRabbitMQ } = require("./config/rabbitmq.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

connectRabbitMQ();

app.use('/api/student', studentRoutes);


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
