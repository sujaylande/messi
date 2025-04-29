const morgan = require("morgan");

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const cookieParser = require('cookie-parser');


const db = require("./config/db.js");
const studentRoutes = require('./routes/student.js');
const { connectRabbitMQ } = require("./config/rabbitmq.js");

const app = express();

// app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true
}));


app.use(cookieParser());
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.use((req, res, next) => {
  console.log("Incoming request path:", req.path);
  next();
});


connectRabbitMQ();

app.use('/', studentRoutes);


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
