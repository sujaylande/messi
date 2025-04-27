const { spawn } = require("child_process");
const path = require("path");
const { format } = require("date-fns");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const db = require("../config/db.js");
const cloudinary = require("../config/cloudinary.js");
const { getChannel } = require("../config/rabbitmq.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const { getCurrentMeal } = require("../utils/mealHelper.js"); // assuming you have this function elsewhere
const { error } = require("console");
const axios = require("axios");

const query = util.promisify(db.query).bind(db);

module.exports.scanManually = async (req, res) => {
  const { reg_no } = req.body;
  const block_no = req.manager?.block_no;

  const { slot: currentslot, cost: mealcost } = getCurrentMeal();

  if (!currentslot) {
    return res
      .status(200)
      .json({ message: "Mess is closed, come in the next slot." });
  }

  const mealslot = currentslot.charAt(0).toUpperCase() + currentslot.slice(1); // Capitalize

  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD

  //to convert into local time
  const timestamp =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  try {
    // Check if student is registered
    const studentRows = await query(
      "SELECT reg_no FROM students WHERE reg_no = ? AND block_no = ?",
      [reg_no, block_no]
    );
    
    if (studentRows.length === 0) {
      return res
        .status(200)
        .json({ message: "Not registered, you have to pay." });
    }
    
    // Check if already eaten
    const attendanceRows = await query(
      "SELECT reg_no FROM attendance WHERE reg_no = ? AND date = ? AND meal_slot = ? AND block_no = ?",
      [reg_no, date, mealslot, block_no]
    );
    
    if (attendanceRows.length > 0) {
      return res.status(200).json({ message: "You have already eaten." });
    }

    // Mark attendance
    await query(
      `INSERT INTO attendance 
        (reg_no, date, meal_slot, meal_cost, timestamp, block_no)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [reg_no, date, mealslot, mealcost, timestamp, block_no]
    );

    const secret = process.env.SHARED_SECRET

    const attendanceData = {
      reg_no: reg_no,
      date: date,
      meal_slot: mealslot, 
      meal_cost: mealcost,
      block_no: block_no,
      timestamp: timestamp,
      secret: secret
    };

    const channel = getChannel();

    if (channel) {
      await channel.assertQueue("attendance_queue_for_student");
      channel.sendToQueue(
        "attendance_queue_for_student",
        Buffer.from(JSON.stringify(attendanceData))
      );
      console.log("attendance sent to student queue");
    }

    const payload = {
      reg_no: String(reg_no),
      date: String(date),
      meal_slot: String(mealslot), 
      meal_cost: String(mealcost),
      block_no: String(block_no),
      timestamp: String(timestamp),
    };

    if (channel) {
      await channel.assertQueue("manually_attendance_queue_for_script");
      channel.sendToQueue(
        "manually_attendance_queue_for_script",
        Buffer.from(JSON.stringify({payload, secret}))
      );
      console.log("attendance sent to queue");
    }

    return res.status(200).json({ message: "Attendance marked successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
};

module.exports.getManagerProfile = async (req, res, next) => {
  res.status(200).json({ manager: req.manager });
};

module.exports.managerLogout = (req, res) => {
  res.clearCookie("manager-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports.managerLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const query = `SELECT * FROM managers WHERE email = ? LIMIT 1`;

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const manager = results[0];

    console.log(manager);

    try {
      const isMatch = await bcrypt.compare(password, manager.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        {
          email: manager.email,
          block_no: manager.block_no,
          name: manager.name,
          role: manager.role,
          mess_name: manager.mess_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      // avoid naming conflict
      const { password: dbPassword, ...managerWithoutPassword } = manager;

      // res.cookie('manager-token', token);
      // res.cookie('student-token', token);
      res.cookie("manager-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });

      res.status(200).json({ manager: managerWithoutPassword });
    } catch (compareError) {
      console.error(compareError);
      res.status(500).json({ message: "Password check failed" });
    }
  });
};

// module.exports.register = async (req, res) => {
//   try {
//     const { name, email, reg_no, roll_no, password } = req.body;
//     const block_no = req.manager.block_no;

//     if (!name || !email || !reg_no || !roll_no || !password) {
//       return res
//         .status(400)
//         .json({ error: "Name, email, reg_no, roll_no, and password are required" });
//     }

//     const result = await query(
//       "SELECT * FROM students WHERE block_no = ? AND (email = ? OR roll_no = ? OR reg_no = ?)",
//       [block_no, email, roll_no, reg_no]
//     );

//     if (result.length) {
//       return res.status(400).json({ error: "Student with this email, roll number, or registration number already exists in this block" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const scriptPath = path.join(__dirname, "..", "scripts", "python", "add_faces.py");

//     const python = spawn("python", [
//       scriptPath,
//       name,
//       email,
//       reg_no,
//       roll_no,
//       hashedPassword,
//       block_no
//     ]);

//     let output = "";
//     let error = "";

//     python.stdout.on("data", (data) => {
//       output += data.toString();
//     });

//     python.stderr.on("data", (data) => {
//       error += data.toString();
//     });

//     python.on("close", (code) => {
//       console.log(`Python script exited with code ${code}`);
//       if (code !== 0) {
//         return res.status(500).json({ error: "Python script error", details: error });
//       }
//     });

//     res.status(201).json({ message: "Registration process started in background!" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports.scan = (req, res) => {
//   try {
//     const block_no = req.manager.block_no;

//     const checkQuery = `SELECT * FROM students WHERE block_no = ?;`;
//     db.query(checkQuery,[block_no], (err, result) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (result.length === 0) {
//         return res.status(404).json({ error: "No student found" });
//       }

//       const scriptPath = path.join(
//         __dirname,
//         "..", // Go up one level from controllers
//         "scripts",
//         "python",
//         "test.py"
//       );

//       const python = spawn("python", [scriptPath]);

//       python.stdout.on("data", (data) => {
//         console.log(data.toString());
//       });
//       python.stderr.on("data", (data) => {
//         console.error(data.toString());
//       });
//       python.on("close", (code) => {
//         console.log(`Python script exited with code ${code}`);
//       });

//       res
//         .status(200)
//         .json({ message: "Scaning process started in background!" });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports.register = async (req, res) => {
//   try {
//     const { name, email, reg_no, roll_no, password } = req.body;
//     const block_no = req?.manager?.block_no || 10;

//     if (!name || !email || !reg_no || !roll_no || !password) {
//       return res.status(400).json({
//         error: "Name, email, reg_no, roll_no, and password are required",
//       });
//     }

//     const result = await query(
//       "SELECT * FROM students WHERE block_no = ? AND (email = ? OR roll_no = ? OR reg_no = ?)",
//       [block_no, email, roll_no, reg_no]
//     );

//     if (result.length) {
//       return res.status(400).json({
//         error:
//           "Student with this email, roll number, or registration number already exists in this block",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ Call FastAPI to start background face registration
//     await axios.post(
//       "http://localhost:8000/register",
//       {
//         name,
//         email,
//         reg_no,
//         roll_no,
//         password: hashedPassword,
//         block_no: String(block_no),
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // ✅ Don’t wait for FastAPI to complete processing
//     return res.status(201).json({
//       message: "Student registered. Face registration started in background.",
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

module.exports.register = async (req, res) => {
  try {
    const { name, email, reg_no, roll_no, password } = req.body;
    const block_no = req?.manager?.block_no || 10;

    if (!name || !email || !reg_no || !roll_no || !password) {
      return res.status(400).json({
        error: "Name, email, reg_no, roll_no, and password are required",
      });
    }

    const result = await query(
      "SELECT * FROM students WHERE block_no = ? AND (email = ? OR roll_no = ? OR reg_no = ?)",
      [block_no, email, roll_no, reg_no]
    );

    if (result.length) {
      return res.status(400).json({
        error:
          "Student with this email, roll number, or registration number already exists in this block",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Send message to RabbitMQ
    const payload = {
      name,
      email,
      reg_no,
      roll_no,
      password: hashedPassword,
      block_no: String(block_no),
    };

    const secret = process.env.SHARED_SECRET;

    const channel = getChannel();
    if (channel) {
      await channel.assertQueue("start_registration_queue_for_script");
      channel.sendToQueue(
        "start_registration_queue_for_script",
        Buffer.from(JSON.stringify({ payload, secret }))
      );
      console.log("start_registration_queue_for_script sent to queue");
    }

    return res.status(201).json({
      message: "Student registered. Face registration started in background.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// module.exports.scan = async (req, res) => {
//   try {
//     const block_no = req.manager.block_no;

//     const checkQuery = `SELECT * FROM students WHERE block_no = ?;`;
//     db.query(checkQuery, [block_no], async (err, result) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (result.length === 0) {
//         return res.status(404).json({ error: "No student found" });
//       }

//       try {
//         const response = await axios.post(
//           "http://localhost:8000/attendance",
//           {
//             block_no: String(block_no),
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         return res.status(200).json({
//           message: "Attendance processing started.",
//           data: response.data,
//         });
//       } catch (apiErr) {
//         console.log(apiErr);
//         console.error(
//           "FastAPI Error:",
//           apiErr.response?.data || apiErr.message
//         );
//         return res
//           .status(500)
//           .json({ error: "Failed to call attendance service" });
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

module.exports.scan = async (req, res) => {
  const block_no = req.manager.block_no;
  const SECRET_API_KEY = process.env.SHARED_SECRET;

  const { slot: currentslot, cost: mealcost } = getCurrentMeal();

  if (!currentslot) {
    return res
      .status(200)
      .json({ message: "Mess is closed, come in the next slot." });
  }

  console.log(SECRET_API_KEY);

  const checkQuery = `SELECT * FROM students WHERE block_no = ?;`;
  db.query(checkQuery, [block_no], async (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "No student found" });
    }

    try {
      const payload = {
        block_no,
        secret: SECRET_API_KEY,
      };

      const channel = getChannel();
      if (channel) {
        await channel.assertQueue("start_attendance_queue_for_script");
        channel.sendToQueue(
          "start_attendance_queue_for_script",
          Buffer.from(JSON.stringify(payload))
        );
        console.log("start_attendance_queue_for_script sent to queue");
      }

      return res.status(202).json({ message: "Attendance task queued." });
    } catch (err) {
      console.error("RabbitMQ Error:", err.message);
      return res
        .status(500)
        .json({ error: "Failed to enqueue attendance task" });
    }
  });
};

module.exports.messStatistics = (req, res) => {
  try {
    const block_no = req.manager.block_no;

    const query = `
      SELECT 
        DATE_FORMAT(date, '%d-%m-%Y') AS formatted_date,
        SUM(CASE WHEN meal_slot = 'Breakfast' THEN 1 ELSE 0 END) AS breakfast_count,
        SUM(CASE WHEN meal_slot = 'Lunch' THEN 1 ELSE 0 END) AS lunch_count,
        SUM(CASE WHEN meal_slot = 'Snack' THEN 1 ELSE 0 END) AS snack_count,
        SUM(CASE WHEN meal_slot = 'Dinner' THEN 1 ELSE 0 END) AS dinner_count
      FROM attendance
      WHERE block_no = ?
      GROUP BY formatted_date
      ORDER BY STR_TO_DATE(formatted_date, '%d-%m-%Y') DESC;
    `;

    db.query(query, [block_no], (err, result) => {
      if (err) {
        console.error("Error fetching attendance summary:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.studentStatistics = (req, res) => {
  try {
    const { reg_no } = req.params;
    const block_no = req.manager.block_no;

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
        WHERE reg_no = ? AND block_no = ?
        GROUP BY formatted_date
        ORDER BY STR_TO_DATE(formatted_date, '%d-%m-%Y') DESC;
      `;

      db.query(query, [reg_no, block_no], (err, attendanceResult) => {
        if (err) {
          console.error("Error fetching student mess attendance:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const totalAmount = attendanceResult.reduce(
          (sum, row) => sum + Number(row.total_cost || 0),
          0
        );

        res.json({
          studentDetails,
          attendance: attendanceResult,
          totalAmount,
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.activeStudents = (req, res) => {
  const block_no = req.manager.block_no;
  const query = `SELECT 
                   COUNT(CASE WHEN status = 'active' THEN 1 END) AS active, 
                   COUNT(CASE WHEN status = 'inactive' THEN 1 END) AS inactive 
                 FROM students WHERE block_no = ?;`;
  db.query(query, [block_no], (err, result) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    res.json(result[0]);
  });
};

module.exports.todaysAttendance = (req, res) => {
  const block_no = req.manager.block_no;
  const query = `SELECT 
                   COUNT(CASE WHEN meal_slot = 'Breakfast' THEN 1 END) AS breakfast,
                   COUNT(CASE WHEN meal_slot = 'Lunch' THEN 1 END) AS lunch,
                   COUNT(CASE WHEN meal_slot = 'Snack' THEN 1 END) AS snack,
                   COUNT(CASE WHEN meal_slot = 'Dinner' THEN 1 END) AS dinner
                 FROM attendance
                 WHERE date = CURDATE() AND block_no = ?;`;
  db.query(query, [block_no], (err, result) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    res.json(result);
  });
};

// module.exports.attendanceProbability = (req, res) => {

//   const cachedData = cache.get("attendance-probability");
//   const block_no = req.manager.block_no;

//   if (cachedData) {
//     // console.log("attendance-probability form node-cache...");
//     return res.json(cachedData);
//   }

//   const query = `
//     SELECT date, meal_slot, COUNT(*) as count
//     FROM attendance
//     WHERE block_no = ?
//     GROUP BY date, meal_slot
//   `;

//   db.query(query,[block_no], (err, results) => {
//     if (err) {
//       console.error("Database query error:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(200).json([]);
//     }

//     const scriptPath = path.join(__dirname,"../", "scripts", "python", "forecast.py");

//     const pythonProcess = spawn("python", [
//       scriptPath,
//       JSON.stringify(results),
//     ]);

//     let dataChunks = "";

//     pythonProcess.stdout.on("data", (data) => {
//       dataChunks += data.toString();
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       console.error("Python Error:", data.toString());
//     });

//     pythonProcess.on("close", (code) => {
//       if (code === 0) {
//         try {
//           const forecastData = JSON.parse(dataChunks);
//           cache.set("attendance-probability", forecastData);
//           res.status(200).json(forecastData);
//         } catch (error) {
//           console.error("JSON Parsing Error:", error);
//           res.status(500).json({ error: "Failed to parse forecast data" });
//         }
//       } else {
//         res.status(500).json({ error: "Python script execution failed" });
//       }
//     });
//   });
// };

// module.exports.attendanceProbability = async (req, res) => {
//   // const cachedData = cache.get("attendance-probability");
//   const block_no = req.manager.block_no;

//   // if (cachedData) {
//   //   return res.json(cachedData);
//   // }

//   try {
//     const response = await axios.get(
//       `http://localhost:8000/forecast/${block_no}`
//     );
//     cache.set("attendance-probability", response.data);
//     res.json(response.data);
//   } catch (err) {
//     console.error("Error calling FastAPI:", err.message);
//     res.status(500).json({ error: "Failed to get forecast data" });
//   }
// };

module.exports.attendanceProbability = async (req, res) => {
  const block_no = req.manager.block_no;
  // const cachedData = cache.get("attendance-probability");

  // if (cachedData) {
  //   return res.json(cachedData);
  // }

  try {
    const response = await axios.get(
      `http://localhost:8000/forecast/${block_no}`,
      {
        headers: {
          secret: process.env.SHARED_SECRET,
        },
      }
    );

    cache.set("attendance-probability", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Error calling FastAPI:", err.message);
    res.status(500).json({ error: "Failed to get forecast data" });
  }
};

module.exports.updateStudentStatus = (req, res) => {
  const { reg_no, status } = req.body;
  const block_no = req.manager.block_no;

  if (!reg_no || !status) {
    return res.status(400).json({ error: "Reg No and status are required" });
  }

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const checkQuery = `
    SELECT status FROM students WHERE reg_no = ? AND block_no = ?;
  `;

  db.query(checkQuery, [reg_no, block_no], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const currentStatus = result[0].status;

    if (currentStatus === status) {
      return res.status(200).json({ message: `Student is already ${status}` });
    }

    const updateQuery = `
      UPDATE students
      SET status = ?
      WHERE reg_no = ? AND block_no = ?;
    `;

    db.query(updateQuery, [status, reg_no, block_no], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: "Failed to update status" });
      }

      res.json({ message: `Student status updated to ${status}` });
    });
  });
};

module.exports.studentStatusList = (req, res) => {
  const { status } = req.query;
  const block_no = req.manager.block_no;

  if (!status || !["active", "inactive"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const query =
    "SELECT reg_no, name FROM students WHERE status = ? AND block_no = ?;";
  db.query(query, [status, block_no], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};

// module.exports.removeStudent = async (req, res) => {
//   try {
//     const { reg_no } = req.params;
//     const block_no = req.manager.block_no;

//     console.log(reg_no, block_no);

//     if (!reg_no) {
//       return res.status(400).json({ error: "Reg No is required" });
//     }

//     const checkQuery = `SELECT * FROM students WHERE reg_no = ? AND block_no = ?;`;
//     db.query(checkQuery, [reg_no, block_no], (err, result) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (result.length === 0) {
//         return res.status(404).json({ error: "Student not found" });
//       }

//       const deleteQuery = `DELETE FROM students WHERE reg_no = ? AND block_no = ?;`;
//       db.query(deleteQuery, [reg_no, block_no], (err) => {
//         if (err) {
//           console.error("Database Error:", err);
//           return res.status(500).json({ error: "Internal Server Error" });
//         }

//         const secret = process.env.SHARED_SECRET;
//         const channel = getChannel();

//         if (channel) {
//           await channel.assertQueue("delete_student_queue_for_student");
//           channel.sendToQueue(
//             "delete_student_queue_for_student",
//             Buffer.from(JSON.stringify({ reg_no, block_no, secret }))
//           );
//           console.log("delete_student_queue_for_student sent to queue");
//         }


       
//         res.status(200).json({ message: "Student removed successfully!" });
//       });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


module.exports.removeStudent = async (req, res) => {
  try {
    const { reg_no } = req.params;
    const block_no = req.manager.block_no;

    if (!reg_no) {
      return res.status(400).json({ error: "Reg No is required" });
    }

    // Promisify db.query
    const query = (sql, params) =>
      new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

    const result = await query(
      `SELECT * FROM students WHERE reg_no = ? AND block_no = ?;`,
      [reg_no, block_no]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    await query(
      `DELETE FROM students WHERE reg_no = ? AND block_no = ?;`,
      [reg_no, block_no]
    );

    const secret = process.env.SHARED_SECRET;
    const channel = getChannel();

    if (channel) {
      await channel.assertQueue("delete_student_queue_for_student");
      channel.sendToQueue(
        "delete_student_queue_for_student",
        Buffer.from(JSON.stringify({ reg_no, block_no, secret }))
      );
      console.log("delete_student_queue_for_student sent to queue");
    }

    const payload = {
      reg_no: String(reg_no),
      block_no: String(block_no),
    };

    console.log(payload)

    if (channel) {
      await channel.assertQueue("delete_student_queue_for_script");
      channel.sendToQueue(
        "delete_student_queue_for_script",
        Buffer.from(JSON.stringify({payload, secret}))
      );
      console.log("delete_student_queue_for_script sent to queue");
    }

    res.status(200).json({ message: "Student removed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.addNotice = async (req, res) => {
  const { notice } = req.body;
  const block_no = req.manager.block_no;

  if (!notice) return res.status(400).json({ error: "Notice cannot be empty" });

  db.query(
    "INSERT INTO notice_board (notice, block_no) VALUES (?, ?)",
    [notice, block_no],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const secret = process.env.SHARED_SECRET

      const channel = getChannel();
      if (channel) {
        await channel.assertQueue("notice_queue");
        channel.sendToQueue(
          "notice_queue",
          Buffer.from(JSON.stringify({ notice, block_no, secret }))
        );
        // console.log("Notice sent to queue");
      }

      res.status(201).json({ message: "Notice added successfully" });
    }
  );
};

module.exports.displayNotice = (req, res) => {
  const block_no = req.manager.block_no;
  db.query(
    "SELECT * FROM notice_board WHERE block_no = ?",
    [block_no],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

module.exports.removeNotice = async (req, res) => {
  const { id } = req.params;
  const block_no = req.manager.block_no;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const checkQuery = `SELECT * FROM notice_board WHERE id = ? AND block_no = ?;`;

  // Wrap MySQL query in a Promise so you can await it
  const queryAsync = (sql, params) =>
    new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

  try {
    const studentResult = await queryAsync(checkQuery, [id, block_no]);

    if (studentResult.length === 0) {
      return res.status(404).json({ error: "Notice not found" });
    }

    await queryAsync("DELETE FROM notice_board WHERE id = ? AND block_no = ?", [
      id,
      block_no,
    ]);

    const secret = process.env.SHARED_SECRET

    // Now send to RabbitMQ queue
    const channel = getChannel(); // make sure this is already established
    if (channel) {
      await channel.assertQueue("remove_notice_queue");
      channel.sendToQueue(
        "remove_notice_queue",
        Buffer.from(JSON.stringify({ id, block_no, secret }))
      );
    }

    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error("Error removing notice:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.addMenu = async (req, res) => {
  const { items, meal_slot } = req.body;

  const block_no = req.manager.block_no;

  if (!items || !meal_slot)
    return res.status(400).json({ error: "Missing fields" });

  const today = format(new Date(), "yyyy-MM-dd");

  db.query(
    "SELECT * FROM menu WHERE meal_slot = ? AND DATE(timestamp) = ? AND block_no = ?",
    [meal_slot, today, block_no],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0)
        return res
          .status(200)
          .json({ message: "Menu already added for this meal today" });

      try {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);

        db.query(
          "INSERT INTO menu (items, img_url, meal_slot, timestamp, block_no) VALUES (?, ?, ?, NOW(), ?)",
          [items, uploadResponse.secure_url, meal_slot, block_no],
          async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const secret = process.env.SHARED_SECRET

            const channel = getChannel();
            if (channel) {
              await channel.assertQueue("menu_queue");
              channel.sendToQueue(
                "menu_queue",
                Buffer.from(
                  JSON.stringify({
                    items,
                    img_url: uploadResponse.secure_url,
                    meal_slot,
                    block_no,
                    secret,
                  })
                )
              );
              // console.log("Menu sent to queue");
            }

            res.status(201).json({ message: "Menu added successfully" });
          }
        );
      } catch (error) {
        res.status(500).json({ error: "Image upload failed" });
      }
    }
  );
};

module.exports.displayMenu = (req, res) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const block_no = req.manager.block_no;

  db.query(
    "SELECT * FROM menu WHERE DATE(timestamp) = ? AND block_no = ?",
    [today, block_no],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// module.exports.displayNegativeFeedbacks = async (req, res) => {
//   try{
//     const cachedData = cache.get("negative_comments");
//     const block_no = req.manager.block_no;

//     if (cachedData) {
//       // console.log("negative_comments form node-cache...");
//       return res.json(cachedData);
//     }

//     const scriptPath = path.resolve(__dirname, "..", "scripts", "python", "feedback_analyzer.py");
//     const pythonProcess = spawn("python", [scriptPath, block_no]);

//     let data = "";
//     pythonProcess.stdout.on("data", (chunk) => {
//       data += chunk.toString();
//     });

//     pythonProcess.on("close", (code) => {
//       if (code === 0) {
//         try {
//           const jsonData = JSON.parse(data);
//           cache.set("negative_comments", jsonData);
//           res.json(jsonData);
//         } catch (parseError) {
//           res.status(500).json({ error: "Invalid JSON output from Python script" });
//         }
//       } else {
//         res.status(500).json({ error: "Python script execution failed" });
//       }
//     });
//   }
//   catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

module.exports.displayNegativeFeedbacks = async (req, res) => {
  try {
    const cachedData = cache.get("negative_comments");
    const block_no = req.manager.block_no;

    if (cachedData) {
      return res.json(cachedData);
    }

    const fastapiURL = `http://localhost:8000/feedback/negative?block_no=${block_no}`;
    const response = await axios.get(fastapiURL, {
      headers: {
        secret: process.env.SHARED_SECRET,
      },
    });

    cache.set("negative_comments", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Error calling FastAPI:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch feedback from sentiment analyzer" });
  }
};

module.exports.feedbackStatistics = (req, res) => {
  const block_no = req.manager.block_no;
  const query = `
      SELECT 
          meal_type,
          COUNT(*) as feedback_count,
          AVG(taste_rating) as avg_taste,
          AVG(hygiene_rating) as avg_hygiene,
          AVG(quantity_rating) as avg_quantity,
          SUM(want_change) as change_requests
      FROM feedback 
      WHERE DATE(feedback_date) = CURDATE() AND block_no = ?
      GROUP BY meal_type;
  `;

  db.execute(query, [block_no], (error, results) => {
    if (error) {
      console.error("Error fetching feedback stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};
