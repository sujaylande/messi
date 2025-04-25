const { format } = require("date-fns");
const db = require("../config/db.js");
const { getChannel } = require("../config/rabbitmq.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.getStudentProfile = async (req, res, next) => {
  res.status(200).json({ student: req.student });
}

module.exports.studentLogout = (req, res) => {
  res.clearCookie("student-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logout successful" });
}

module.exports.studentLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const query = `SELECT * FROM students WHERE email = ? LIMIT 1`;

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const student = results[0];

    try {
      const isMatch = await bcrypt.compare(password, student.password);

      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        {
          email: student.email,
          block_no: student.block_no,
          name: student.name,
          role: student.role,
          reg_no: student.reg_no,
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      // avoid naming conflict
      const { password: dbPassword, ...studentWithoutPassword } = student;

      // res.cookie('student-token', token);
      res.cookie('student-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });
      
      res.status(200).json({ student: studentWithoutPassword });

    } catch (compareError) {
      console.error(compareError);
      res.status(500).json({ message: 'Password check failed' });
    }
  });
};

module.exports.studentStatistics = (req, res) => {
  try{
    const { reg_no, block_no } = req.params;

    if (!reg_no) {
      return res.status(400).json({ error: "Reg No is required" });
    }

    const checkQuery = `SELECT * FROM students WHERE reg_no = ? AND block_no = ?;`;
    db.query(checkQuery, [reg_no, block_no], (err, studentResult) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

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

      db.query(query, [reg_no], (err, attendanceResult) => {
        if (err) {
          console.error("Error fetching student mess attendance:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const totalAmount = attendanceResult.reduce(
          (sum, row) => sum + Number(row.total_cost || 0),
          0
        );

        //send details without password
        const {password, ...studentwithoutpassword} = studentDetails;

        res.json({
          studentwithoutpassword,
          attendance: attendanceResult,
          totalAmount,
        });
      });
    });
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.displayNotice = (req, res) => {
  const block_no = req.student.block_no;
  db.query("SELECT * FROM notice_board WHERE block_no = ?", [block_no], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports.displayMenu = (req, res) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const block_no = req.student.block_no;
  
  db.query(
    "SELECT * FROM menu WHERE DATE(timestamp) = ? AND block_no = ?",
    [today, block_no],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// module.exports.feedbackForm = async (req, res) => {

//   try {
//     const { reg_no, meal_type, taste, hygiene, quantity, want_change, comments } =
//     req.body;

//     if (
//       !reg_no ||
//       !meal_type ||
//       !taste ||
//       !hygiene ||
//       !quantity
//     ) {
//       return res.status(400).json({
//         error:
//           "reg_no, meal_type, taste, hygiene, quantity and want_change  are required",
//       });
//     }

//     const query = `INSERT INTO feedback (reg_no, meal_type, taste_rating, hygiene_rating, quantity_rating, want_change, comments, feedback_date) 
//                    VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`;

//     await db.execute(query, [
//       reg_no,
//       meal_type,
//       taste,
//       hygiene,
//       quantity,
//       want_change,
//       comments,
//     ]);

//     res.status(201).json({ message: "Feedback submitted successfully!" });
//   } catch (error) {
//     console.error("Error submitting feedback:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


module.exports.feedbackForm = async (req, res) => {
  try {
    const { reg_no, block_no, meal_type, taste, hygiene, quantity, want_change, comments } = req.body;

    console.log(req.body)

    if (!reg_no || !block_no || !meal_type || !taste || !hygiene || !quantity) {
      return res.status(400).json({
        error: "reg_no, meal_type, taste, hygiene, quantity, and want_change are required",
      });
    }

    const query = `
      INSERT INTO feedback (reg_no, block_no, meal_type, taste_rating, hygiene_rating, quantity_rating, want_change, comments, feedback_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
    `;

    await db.execute(query, [
      reg_no,
      block_no,
      meal_type,
      taste,
      hygiene,
      quantity,
      want_change,
      comments,
    ]);

    // Publish feedback to Manager Service via RabbitMQ
    const channel = getChannel();
    if (channel) {
      const feedbackData = {
        reg_no,
        block_no,
        meal_type,
        taste,
        hygiene,
        quantity,
        want_change,
        comments,
        secret: process.env.SHARED_SECRET // 🛡️ Add the shared secret here
      };
      channel.sendToQueue("feedback_queue", Buffer.from(JSON.stringify(feedbackData)));
      console.log("📤 Feedback sent to Manager Service!");
    } else {
      console.error("❌ Failed to publish feedback: RabbitMQ channel unavailable.");
    }

    // if (channel) {
    //   const feedbackData = { reg_no, block_no, meal_type, taste, hygiene, quantity, want_change, comments };
    //   channel.sendToQueue("feedback_queue_for_scipt_service", Buffer.from(JSON.stringify(feedbackData)));
    //   console.log("📤 Feedback sent to script Service!");
    // } else {
    //   console.error("❌ Failed to publish feedback: RabbitMQ channel unavailable.");
    // }

    if (channel) {
      const feedbackData = {
        reg_no,
        block_no,
        meal_type,
        taste,
        hygiene,
        quantity,
        want_change,
        comments,
        secret: process.env.SHARED_SECRET // 🛡️ Add the shared secret here
      };
    
      channel.sendToQueue(
        "feedback_queue_for_scipt_service",
        Buffer.from(JSON.stringify(feedbackData))
      );
    
      console.log("📤 Feedback sent to script Service!");
    } else {
      console.error("❌ Failed to publish feedback: RabbitMQ channel unavailable.");
    }

    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
};
