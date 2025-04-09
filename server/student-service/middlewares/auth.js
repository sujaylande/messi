const jwt = require("jsonwebtoken");
const db = require("../config/db.js");
const util = require("util");

// Promisify db.query so we can use async/await
const query = util.promisify(db.query).bind(db);

module.exports.authStudent = async (req, res, next) => {
  // const token = req.cookies['student-token'] || req.headers.authorization?.split(' ')[1];

  let token = null;

  if (req.cookies["student-token"]) {
    token = req.cookies["student-token"];
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "student") {
      return res.status(403).json({ message: "Forbidden: Not a student" });
    }

    // Find manager in DB
    // const [student] = await query('SELECT * FROM students WHERE email = ?', [decoded.email]);
    // if (!student) {
    //   return res.status(401).json({ message: 'Unauthorized: Student not found' });
    // }

    req.student = decoded;
    next();
  } catch (err) {
    console.error("AuthStudent Error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
