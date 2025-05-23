const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');


const db = require("./config/db.js");
const managerRoutes = require('./routes/manager.js');
const { connectRabbitMQ } = require("./config/rabbitmq.js");


const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true
}));

// app.use(morgan('dev'));
app.use(cookieParser());
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//   } else {
//     console.log("Connected to MySQL");
//   }
// });

db.query("SELECT 1")
  .then(([rows]) => {
    console.log("✅ DB pool is working:", rows);
  })
  .catch((err) => {
    console.error("❌ DB query failed:", err);
  });
  
connectRabbitMQ();

// app.use('/api/manager', managerRoutes);
app.use('/', managerRoutes);

app.use((req, res, next) => {
  console.log("Incoming request path:", req.path);
  next();
});

module.exports = app;
// app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
