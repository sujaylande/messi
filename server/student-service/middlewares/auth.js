const jwt = require("jsonwebtoken");
const db = require("../config/db.js");
const util = require("util");

// Promisify db.query so we can use async/await
const query = util.promisify(db.query).bind(db);

module.exports.authStudent = async (req, res, next) => {
  let token = null;

  // Extract token from cookie or Authorization header
  if (req.cookies && req.cookies["student-token"]) {
    token = req.cookies["student-token"];
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If token is missing or empty, return 401 early
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure role is student
    if (decoded.role !== "student") {
      return res.status(403).json({ message: "Forbidden: Not a student" });
    }

    req.student = decoded;
    next();
  } catch (err) {
    console.error("AuthStudent Error:", err.message); // Avoid printing full stack in production
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
