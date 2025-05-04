const { format } = require("date-fns");
const db = require("../config/db.js");
const { getChannel } = require("../config/rabbitmq.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.getStudentProfile = async (req, res, next) => {
  res.status(200).json({ student: req.student });
};

module.exports.studentLogout = (req, res) => {
  const refreshToken = req.cookies["student-refresh-token"];

  if (refreshToken) {
    const decoded = jwt.decode(refreshToken);

    if (decoded && decoded.exp) {
      const expiryDate = new Date(decoded.exp * 1000); // JWT exp is in seconds

      const query = `INSERT INTO blacklisted_tokens (token, expiry) VALUES (?, ?)`;

      db.query(query, [refreshToken, expiryDate], (err, result) => {
        if (err) console.error("Error blacklisting token:", err);
      });
    }
  }

  res.clearCookie("student-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.clearCookie("student-refresh-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logout successful" });
};

module.exports.studentLogin = async (req, res) => {
  try{
  const { email, password } = req.body;

  console.log("login");

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const query = `SELECT * FROM students WHERE email = ? LIMIT 1`;

   const[results] = await db.query(query, [email])

    console.log(results);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const student = results[0];

    console.log(student)

    try {
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const payload = {
        email: student.email,
        block_no: student.block_no,
        name: student.name,
        role: student.role,
        reg_no: student.reg_no,
      };

      // console.log(process.env.JWT_SECRET)

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
      }); // Shorter lifetime
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "1d",
      });

      const { password: dbPassword, ...studentWithoutPassword } = student;

      res.cookie("student-token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 min
      });

      res.cookie("student-refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({ student: studentWithoutPassword });
    } catch (compareError) {
      console.error(compareError);
      res.status(500).json({ message: "Password check failed" });
    }
  } catch (err){
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.refreshToken = async (req, res) => {

  try {

  const refreshToken = req.cookies["student-refresh-token"];

  console.log("iam herer");

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  // Check blacklist
  const query = `SELECT token FROM blacklisted_tokens WHERE token = ? LIMIT 1`;
  const [results] = await db.query(query, [refreshToken])

    if (results.length > 0) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Refresh token blacklisted" });
    }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const payload = {
        email: decoded.email,
        block_no: decoded.block_no,
        name: decoded.name,
        role: decoded.role,
        reg_no: decoded.reg_no,
      };

      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      res.cookie("student-token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 1 * 60 * 1000, // 15 min
      });

      const newRefreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("student-refresh-token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({ message: "Access token refreshed" });
    } catch (err) {
      console.error("Refresh error:", err.message);
      return res.status(403).json({ message: "Invalid refresh token" });
    }
};

module.exports.studentStatistics = async (req, res) => {
  try {
    const { reg_no, block_no } = req.params;

    if (!reg_no) {
      return res.status(400).json({ error: "Reg No is required" });
    }

    const checkQuery = `SELECT * FROM students WHERE reg_no = ? AND block_no = ?;`;
    const [studentResult] = await db.query(checkQuery, [reg_no, block_no])

      if (studentResult.length === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      const studentDetails = studentResult[0];

      const query = `
        SELECT 
            DATE_FORMAT(date, '%d-%m-%Y') AS formatted_date,
            MAX(CASE WHEN meal_slot = 'Breakfast' THEN TIME(timestamp) END) AS breakfast_time,
            MAX(CASE WHEN meal_slot = 'Lunch' THEN TIME(timestamp) END) AS lunch_time,
            MAX(CASE WHEN meal_slot = 'Snack' THEN TIME(timestamp) END) AS snack_time,
            MAX(CASE WHEN meal_slot = 'Dinner' THEN TIME(timestamp) END) AS dinner_time,
            SUM(meal_cost) AS total_cost
        FROM attendance
        WHERE reg_no = ?
        GROUP BY formatted_date
        ORDER BY STR_TO_DATE(formatted_date, '%d-%m-%Y') DESC;
      `;

      const [attendanceResult] = await db.query(query, [reg_no])

        const totalAmount = attendanceResult.reduce(
          (sum, row) => sum + Number(row.total_cost || 0),
          0
        );

        //send details without password
        const { password, ...studentwithoutpassword } = studentDetails;

        res.json({
          studentwithoutpassword,
          attendance: attendanceResult,
          totalAmount,
        });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.displayNotice = async (req, res) => {
  try{
  const block_no = req.student.block_no;
  const [results] = await db.query(
    "SELECT notice FROM notice_board WHERE block_no = ?",
    [block_no])
    res.json(results);
  }catch (err){
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.displayMenu = async (req, res) => {
  try{
  const today = format(new Date(), "yyyy-MM-dd");
  const block_no = req.student.block_no;

  const [results] = await db.query(
    "SELECT id, items, img_url, meal_slot FROM menu WHERE DATE(timestamp) = ? AND block_no = ?",
    [today, block_no])
    res.json(results);
  }catch (err){
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.feedbackForm = async (req, res) => {
  try{
  const {
    reg_no,
    block_no,
    meal_type,
    taste,
    hygiene,
    quantity,
    want_change,
    comments,
  } = req.body;

  if (!reg_no || !block_no || !meal_type || !taste || !hygiene || !quantity) {
    return res.status(400).json({
      error: "reg_no, meal_type, taste, hygiene, quantity, and want_change are required",
    });
  }

  const today = new Date().toISOString().split("T")[0];

  console.log(today);

  // 🛑 Check for duplicate feedback
  const checkQuery = `SELECT id FROM feedback WHERE reg_no = ? AND meal_type = ? AND DATE(feedback_date) = ? LIMIT 1`;
  const [result] = await db.query(checkQuery, [reg_no, meal_type, today])

    if (result.length > 0) {
      return res.status(409).json({ error: "Feedback already submitted for this meal today" });
    }

    // ✅ Insert feedback into the database
    const insertQuery = `
      INSERT INTO feedback (reg_no, block_no, meal_type, taste_rating, hygiene_rating, quantity_rating, want_change, comments, feedback_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
    `;
    db.query(insertQuery, [
      reg_no,
      block_no,
      meal_type,
      taste,
      hygiene,
      quantity,
      want_change,
      comments,
    ])

      // 📨 Send feedback data to RabbitMQ queues
      const feedbackData = {
        reg_no,
        block_no,
        meal_type,
        taste,
        hygiene,
        quantity,
        want_change,
        comments,
        secret: process.env.SHARED_SECRET,
      };

      const channel = getChannel();

      if (channel) {
        channel.sendToQueue("feedback_queue", Buffer.from(JSON.stringify(feedbackData)));
        channel.sendToQueue("feedback_queue_for_script_service", Buffer.from(JSON.stringify(feedbackData)));
        console.log("📤 Feedback sent to both Manager and Script Services!");
      } else {
        console.error("❌ Failed to publish feedback: RabbitMQ channel unavailable.");
      }

      res.status(201).json({ message: "Feedback submitted successfully!" });
    }catch (err){
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
};


