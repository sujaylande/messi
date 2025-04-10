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


const query = util.promisify(db.query).bind(db);



module.exports.getManagerProfile = async (req, res, next) => {
  res.status(200).json({ manager: req.manager });
}

module.exports.managerLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const query = `SELECT * FROM managers WHERE email = ? LIMIT 1`;

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const manager = results[0];

    try {
      const isMatch = await bcrypt.compare(password, manager.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        {
          email: manager.email,
          block_no: manager.block_no,
          name: manager.name,
          role: manager.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      // avoid naming conflict
      const { password: dbPassword, ...managerWithoutPassword } = manager;

      res.cookie('manager-token', token);
      res.status(200).json({ token, manager: managerWithoutPassword });

    } catch (compareError) {
      console.error(compareError);
      res.status(500).json({ message: 'Password check failed' });
    }
  });
};

module.exports.register = async (req, res) => {
  try {
    const { name, email, reg_no, roll_no, password } = req.body;
    const block_no = req.manager.block_no;

    if (!name || !email || !reg_no || !roll_no || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, reg_no, roll_no, and password are required" });
    }

    const result = await query(
      "SELECT * FROM students WHERE block_no = ? AND (email = ? OR roll_no = ? OR reg_no = ?)",
      [block_no, email, roll_no, reg_no]
    );

    if (result.length) {
      return res.status(400).json({ error: "Student with this email, roll number, or registration number already exists in this block" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const scriptPath = path.join(__dirname, "..", "scripts", "python", "add_faces.py");

    const python = spawn("python", [
      scriptPath,
      name,
      email,
      reg_no,
      roll_no,
      hashedPassword,
      block_no
    ]);

    let output = "";
    let error = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code !== 0) {
        return res.status(500).json({ error: "Python script error", details: error });
      }
    });

    res.status(201).json({ message: "Registration process started in background!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// module.exports.register = (req, res) => {
//   try {
//     const { name, email, reg_no, roll_no, password } = req.body;

//     const block_no = req.manager.block_no;

//     // console.log(name, email, reg_no, roll_no, password);

//     if (!name || !email || !reg_no || !roll_no || !password) {
//       return res
//         .status(400)
//         .json({ error: "Name, email, reg_no, and roll_no are required" });
//     }

//     db.query(
//       "SELECT * FROM students WHERE block_no = ? AND (email = ? OR roll_no = ? OR reg_no = ?)",
//       [block_no, email, roll_no, reg_no],
//       (err, result) => {
//         if (err) {
//           return res.status(500).json({ error: err.message });
//         }
//         if (result.length) {
//           return res.status(400).json({ error: "Student with this email, roll number, or registration number already exists in this block" });
//         }
    
//         // Trigger Python Script
//         const scriptPath = path.join(
//           __dirname,
//           "..", // Go up one level from controllers
//           "scripts",
//           "python",
//           "add_faces.py"
//         );
    
//         console.log("in reg", scriptPath);

//         const hashedPassword = await bcrypt.hash(password, 10);
    
//         const python = spawn("python", [
//           scriptPath,
//           name,
//           email,
//           reg_no,
//           roll_no,
//           hashedPassword,
//           block_no
//         ]);
    
//         let output = "";
//         let error = "";
    
//         python.stdout.on("data", (data) => {
//           output += data.toString();
//         });
    
//         python.stderr.on("data", (data) => {
//           error += data.toString();
//         });
    
//         python.on("close", (code) => {
//           console.log(`Python script exited with code ${code}`);
//         });
    
//         res
//           .status(201)
//           .json({ message: "Registration process started in background!" });
//       }
//     );    

//     // db.query(
//     //   "SELECT * FROM students WHERE email = ? OR roll_no = ? OR reg_no = ?",
//     //   [email, roll_no, reg_no],
//     //   (err, result) => {
//     //     if (err) {
//     //       return res.status(500).json({ error: err.message });
//     //     }
//     //     if (result.length) {
//     //       return res.status(400).json({ error: "Student with this email, roll number, or registration number already exists" });
//     //     }

//     //     // Trigger Python Script
//     //     const scriptPath = path.join(
//     //       __dirname,
//     //       "..", // Go up one level from controllers
//     //       "scripts",
//     //       "python",
//     //       "add_faces.py"
//     //     );

//     //     console.log("in reg", scriptPath);

//     //     const python = spawn("python", [
//     //       scriptPath,
//     //       name,
//     //       email,
//     //       reg_no,
//     //       roll_no,
//     //       password
//     //     ]);

//     //     let output = "";
//     //     let error = "";

//     //     python.stdout.on("data", (data) => {
//     //       output += data.toString();
//     //     });

//     //     python.stderr.on("data", (data) => {
//     //       error += data.toString();
//     //     });

//     //     python.on("close", (code) => {
//     //       console.log(`Python script exited with code ${code}`);
//     //     });

//     //     res
//     //       .status(201)
//     //       .json({ message: "Registration process started in background!" });
//     //   }
//     // );
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

module.exports.scan = (req, res) => {
  try {
    const block_no = req.manager.block_no;

    const checkQuery = `SELECT * FROM students WHERE block_no = ?;`;
    db.query(checkQuery,[block_no], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "No student found" });
      }

      const scriptPath = path.join(
        __dirname,
        "..", // Go up one level from controllers
        "scripts",
        "python",
        "test.py"
      );

      const python = spawn("python", [scriptPath]);

      python.stdout.on("data", (data) => {
        console.log(data.toString());
      });
      python.stderr.on("data", (data) => {
        console.error(data.toString());
      });
      python.on("close", (code) => {
        console.log(`Python script exited with code ${code}`);
      });

      res
        .status(200)
        .json({ message: "Scaning process started in background!" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// module.exports.messStatistics = (req, res) => {
//   try{
//     const block_no = req.manager.block_no;

//       const query = `
//         SELECT 
//         DATE_FORMAT(date, '%d-%m-%Y') AS formatted_date,
//         SUM(CASE WHEN meal_slot = 'Breakfast' THEN 1 ELSE 0 END) AS breakfast_count,
//         SUM(CASE WHEN meal_slot = 'Lunch' THEN 1 ELSE 0 END) AS lunch_count,
//         SUM(CASE WHEN meal_slot = 'Snack' THEN 1 ELSE 0 END) AS snack_count,
//         SUM(CASE WHEN meal_slot = 'Dinner' THEN 1 ELSE 0 END) AS dinner_count
//     FROM attendance
//     GROUP BY formatted_date
//     ORDER BY STR_TO_DATE(formatted_date, '%d-%m-%Y') DESC;`;

//       db.query(query, (err, result) => {
//         if (err) {
//           console.error("Error fetching attendance summary:", err);
//           return res.status(500).json({ error: "Internal Server Error" });
//         }
//         res.json(result);
//       });
//     }catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Internal server error" });
//     }
// };

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
  try{
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
  }catch (err) {
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
  db.query(query,[block_no], (err, result) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    res.json(result);
  });
};

module.exports.attendanceProbability = (req, res) => {

  const cachedData = cache.get("attendance-probability");
  const block_no = req.manager.block_no;

  if (cachedData) {
    // console.log("attendance-probability form node-cache...");
    return res.json(cachedData);
  }

  const query = `
    SELECT date, meal_slot, COUNT(*) as count 
    FROM attendance 
    WHERE block_no = ?
    GROUP BY date, meal_slot
  `;

  db.query(query,[block_no], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(200).json([]);
    }

    const scriptPath = path.join(__dirname,"../", "scripts", "python", "forecast.py");

    const pythonProcess = spawn("python", [
      scriptPath,
      JSON.stringify(results),
    ]);

    let dataChunks = "";

    pythonProcess.stdout.on("data", (data) => {
      dataChunks += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python Error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const forecastData = JSON.parse(dataChunks);
          cache.set("attendance-probability", forecastData);
          res.status(200).json(forecastData);
        } catch (error) {
          console.error("JSON Parsing Error:", error);
          res.status(500).json({ error: "Failed to parse forecast data" });
        }
      } else {
        res.status(500).json({ error: "Python script execution failed" });
      }
    });
  });
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

  const query = "SELECT reg_no, name FROM students WHERE status = ? AND block_no = ?;";
  db.query(query, [status, block_no], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};

module.exports.removeStudent = (req, res) => {
  try{
    const { reg_no } = req.params;
    const block_no = req.manager.block_no;

    if (!reg_no) {
      return res.status(400).json({ error: "Reg No is required" });
    }

    const checkQuery = `SELECT * FROM students WHERE reg_no = ? AND block_no = ?;`;
    db.query(checkQuery, [reg_no, block_no], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      // const deleteAttendanceQuery = `DELETE FROM attendance WHERE reg_no = ? AND block_no = ?;`;
      // db.query(deleteAttendanceQuery, [reg_no, block_no], (err) => {
      //   if (err) {
      //     console.error("Database Error:", err);
      //     return res.status(500).json({ error: "Internal Server Error" });
      //   }

        // Call the Python script
        const scriptPath = path.join(
          __dirname,
          "..", // Go up one level from controllers
          "scripts",
          "python",
          "remove_student.py"
        );

        const pythonProcess = spawn("python", [scriptPath, reg_no, block_no]);

        let dataChunks = "";

        pythonProcess.stdout.on("data", (data) => {
          dataChunks += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
          console.error("Python Error:", data.toString());
        });

        pythonProcess.on("close", (code) => {
              console.log(`Python script exited with code ${code}`);
        });

        res.status(200).json({ message: "Student removal process started!" });

      });
    // });
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.addNotice = async (req, res) => {
  const { notice } = req.body;
  const block_no = req.manager.block_no;

  if (!notice) return res.status(400).json({ error: "Notice cannot be empty" });

  db.query("INSERT INTO notice_board (notice, block_no) VALUES (?, ?)", [notice, block_no], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const channel = getChannel();
    if (channel) {
      await channel.assertQueue("notice_queue");
      channel.sendToQueue("notice_queue", Buffer.from(JSON.stringify({ notice, block_no })));
      // console.log("Notice sent to queue");
    }

    res.status(201).json({ message: "Notice added successfully" });
  });
};

module.exports.displayNotice = (req, res) => {
  db.query("SELECT * FROM notice_board", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports.removeNotice = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "id are required" });
  }

  const checkQuery = `SELECT * FROM notice_board WHERE id = ?;`;
  db.query(checkQuery, [reg_no], (err, studentResult) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (studentResult.length === 0) {
      return res.status(404).json({ error: "Notice not found" });
    }
    db.query("DELETE FROM notice_board WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Notice deleted successfully" });
    });
  });
};

module.exports.addMenu = async (req, res) => {
  const { items, meal_slot } = req.body;

  const block_no = req.manager.block_no;

  if (!items || !meal_slot) return res.status(400).json({ error: "Missing fields" });

  const today = format(new Date(), "yyyy-MM-dd");

  db.query("SELECT * FROM menu WHERE meal_slot = ? AND DATE(timestamp) = ? AND block_no = ?", [meal_slot, today, block_no], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(200).json({ message: "Menu already added for this meal today" });

    try {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path);

      db.query(
        "INSERT INTO menu (items, img_url, meal_slot, timestamp, block_no) VALUES (?, ?, ?, NOW(), ?)",
        [items, uploadResponse.secure_url, meal_slot, block_no],
        async (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          const channel = getChannel();
          if (channel) {
            await channel.assertQueue("menu_queue");
            channel.sendToQueue("menu_queue", Buffer.from(JSON.stringify({ items, img_url: uploadResponse.secure_url, meal_slot, block_no })));
            // console.log("Menu sent to queue");
          }

          res.status(201).json({ message: "Menu added successfully" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Image upload failed" });
    }
  });
};

module.exports.displayMenu = (req, res) => {
  const today = format(new Date(), "yyyy-MM-dd");
  db.query(
    "SELECT * FROM menu WHERE DATE(timestamp) = ?",
    [today],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

module.exports.feedbackForm = async (req, res) => {
  const { reg_no, meal_type, taste, hygiene, quantity, want_change, comments } =
    req.body;

  try {
    if (
      !reg_no ||
      !meal_type ||
      !taste ||
      !hygiene ||
      !quantity ||
      !want_change
    ) {
      return res.status(400).json({
        error:
          "reg_no, meal_type, taste, hygiene, quantity and want_change  are required",
      });
    }

    const query = `INSERT INTO feedback (reg_no, meal_type, taste_rating, hygiene_rating, quantity_rating, want_change, comments, feedback_date) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`;

    await db.execute(query, [
      reg_no,
      meal_type,
      taste,
      hygiene,
      quantity,
      want_change,
      comments,
    ]);

    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.displayNegativeFeedbacks = async (req, res) => {
  try{
    const cachedData = cache.get("negative_comments");

    if (cachedData) {
      // console.log("negative_comments form node-cache...");
      return res.json(cachedData);
    }

    const scriptPath = path.resolve(__dirname, "..", "scripts", "python", "feedback_analyzer.py");
    const pythonProcess = spawn("python", [scriptPath]);

    let data = "";
    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const jsonData = JSON.parse(data);
          cache.set("negative_comments", jsonData);
          res.json(jsonData);
        } catch (parseError) {
          res.status(500).json({ error: "Invalid JSON output from Python script" });
        }
      } else {
        res.status(500).json({ error: "Python script execution failed" });
      }
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.feedbackStatistics = (req, res) => {
  const query = `
      SELECT 
          meal_type,
          COUNT(*) as feedback_count,
          AVG(taste_rating) as avg_taste,
          AVG(hygiene_rating) as avg_hygiene,
          AVG(quantity_rating) as avg_quantity,
          SUM(want_change) as change_requests
      FROM feedback 
      WHERE DATE(feedback_date) = CURDATE()
      GROUP BY meal_type;
  `;

  db.execute(query, (error, results) => {
    if (error) {
      console.error("Error fetching feedback stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};
