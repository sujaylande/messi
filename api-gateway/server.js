const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Logger
app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

// Routes
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));

// Default route
app.get('/', (req, res) => {
  res.send('🎯 API Gateway is Running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway started on port ${PORT}`);
});
