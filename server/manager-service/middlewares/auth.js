const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const util = require('util');

// Promisify db.query so we can use async/await
const query = util.promisify(db.query).bind(db);

module.exports.authManager = async (req, res, next) => {
  
  const token = req.headers.authorization?.split(' ')[1] || req.cookies['manager-token'];

 // If token is missing or empty, return 401 early
 if (!token || token.trim() === "") {
  return res.status(401).json({ message: "Unauthorized: No token provided" });
}

  try {

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: Not a manager' });
    }

    req.manager = decoded;
    next();
  } catch (err) {
    console.error('AuthManager Error:', err.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
};



  