const { format } = require("date-fns");
const db = require("../config/db.js");
const { getChannel } = require("../config/rabbitmq.js");



module.exports.studentStatistics = (req, res) => {
  try{
    const { reg_no } = req.params;

    if (!reg_no) {
      return res.status(400).json({ error: "Reg No is required" });
    }

    const checkQuery = `SELECT * FROM students WHERE reg_no = ?;`;
    db.query(checkQuery, [reg_no], (err, studentResult) => {
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

module.exports.displayNotice = (req, res) => {
  db.query("SELECT * FROM notice_board", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
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

  try {
    const { reg_no, meal_type, taste, hygiene, quantity, want_change, comments } =
    req.body;

    if (
      !reg_no ||
      !meal_type ||
      !taste ||
      !hygiene ||
      !quantity
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

