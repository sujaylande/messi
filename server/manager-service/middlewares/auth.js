const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const util = require('util');

// Promisify db.query so we can use async/await
const query = util.promisify(db.query).bind(db);

module.exports.authManager = async (req, res, next) => {
  
  const token = req.headers.authorization?.split(' ')[1] || req.cookies['manager-token'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: Not a manager' });
    }

    // Find manager in DB
    // const [manager] = await query('SELECT * FROM managers WHERE email = ?', [decoded.email]);
    // if (!manager) {
    //   return res.status(401).json({ message: 'Unauthorized: Manager not found' });
    // }

    req.manager = decoded;
    next();
  } catch (err) {
    console.error('AuthManager Error:', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};



  