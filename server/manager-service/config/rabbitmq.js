// const amqp = require("amqplib");

// let channel;

// async function connectRabbitMQ() {
//   try {
//       const connection = await amqp.connect(process.env.RABBITMQ_URL);
//       channel = await connection.createChannel();
//       console.log("🐇 Manager connected to RabbitMQ!");
//       return channel;
//   } catch (error) {
//       console.error("❌ RabbitMQ Connection Failed:", error);
//       setTimeout(connectRabbitMQ, 5000); // Retry after 5 sec
//   }
// }

// const getChannel = () => channel;

// module.exports = { connectRabbitMQ, getChannel };


const amqp = require("amqplib");
const db = require("./db");
const { getIO } = require('../socket'); // import the getter



let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue("feedback_queue"); // Listening for feedback
    await channel.assertQueue("register_student_queue_for_manager"); // Listening for feedback
    await channel.assertQueue("attendance_queue_for_manager"); // Listening for feedback
    await channel.assertQueue("register_status_queue_for_manager"); // Listening for feedback

    console.log("🐇 Manager connected to RabbitMQ!");

    // Listening for feedback submissions
    channel.consume("feedback_queue", async (msg) => {
      if (msg !== null) {
        const feedbackData = JSON.parse(msg.content.toString());
        console.log("📥 Received feedback from Student Service:", feedbackData);

        if (feedbackData.secret !== process.env.SHARED_SECRET) {
          console.warn("❌ Unauthorized message ignored.");
          return channel.ack(msg);
        }
    
        delete feedbackData.secret;

        // Insert feedback into Manager's database
        const query = `
          INSERT INTO feedback (reg_no, block_no, meal_type, taste_rating, hygiene_rating, quantity_rating, want_change, comments, feedback_date) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
        `;

        db.query(
          query,
          [
            feedbackData.reg_no,
            feedbackData.block_no,
            feedbackData.meal_type,
            feedbackData.taste,
            feedbackData.hygiene,
            feedbackData.quantity,
            feedbackData.want_change,
            feedbackData.comments
          ],
          (err) => {
            if (err) console.error("Error inserting feedback in Manager DB:", err.message);
            else console.log("✅ Feedback stored in Manager Database.");
          }
        );

        channel.ack(msg);
      }
    });

    channel.consume("register_student_queue_for_manager", async (msg) => {
      if (msg !== null) {
        const registrationData = JSON.parse(msg.content.toString());

        if (registrationData.secret !== process.env.SHARED_SECRET) {
          console.warn("❌ Unauthorized message ignored.");
          return channel.ack(msg);
        }
    
        delete registrationData.secret;
    
        db.query(
          "INSERT INTO students (name, email, reg_no, roll_no, password, block_no) VALUES (?, ?, ?, ?, ?, ?)",
          [registrationData.name, registrationData.email, registrationData.reg_no, registrationData.roll_no, registrationData.password, registrationData.block_no],
          (err) => {
            if (err) console.error("Error inserting student:", err.message);
            else console.log("✅ student saved in manager Database.");
          }
        );

        channel.ack(msg);
      }
    });

    channel.consume("register_status_queue_for_manager", async (msg) => {
      if (msg !== null) {
        const registrationData = JSON.parse(msg.content.toString());
    
        if (registrationData.secret !== process.env.SHARED_SECRET) {
          console.warn("❌ Unauthorized message ignored.");
          return channel.ack(msg);
        }
    
        delete registrationData.secret;
        
        try {
          const io = getIO();
          // console.log("io", io)
          io.emit("registration-status", registrationData);
          console.log("Emitted to frontend:", registrationData);
        } catch (err) {
          console.error("Socket.io not initialized yet", err);
        }
    
        channel.ack(msg);
      }
    });

    // Listening for attendance Updates
        // channel.consume("attendance_queue_for_manager", async (msg) => {
        //   if (msg !== null) {
        //     const attendanceData = JSON.parse(msg.content.toString());
    
        //     console.log(attendanceData)
    
        //     db.query(
        //       "INSERT INTO attendance (reg_no, date, meal_slot, meal_cost, block_no, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
        //       [attendanceData.reg_no, attendanceData.date, attendanceData.meal_slot, attendanceData.meal_cost, attendanceData.block_no, attendanceData.timestamp],
        //       (err) => {
        //         if (err) console.error("Error inserting attendance:", err.message);
        //         else console.log("✅ attendance saved in Student Database.");
        //       }
        //     );
    
        //     channel.ack(msg);
        //   }
        // });
    
        channel.consume("attendance_queue_for_manager", async (msg) => {
          if (msg !== null) {
            const attendanceData = JSON.parse(msg.content.toString());
        
            if (attendanceData.secret !== process.env.SHARED_SECRET) {
              console.warn("❌ Unauthorized message ignored.");
              return channel.ack(msg);
            }
        
            delete attendanceData.secret; // Clean up before DB insert
        
            db.query(
              "INSERT INTO attendance (reg_no, date, meal_slot, meal_cost, block_no, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
              [
                attendanceData.reg_no,
                attendanceData.date,
                attendanceData.meal_slot,
                attendanceData.meal_cost,
                attendanceData.block_no,
                attendanceData.timestamp
              ],
              (err) => {
                if (err) console.error("Error inserting attendance:", err.message);
                else console.log("✅ attendance saved in Manager DB.");
              }
            );
        
            channel.ack(msg);
          }
        });
        

    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ Connection Failed:", error);
    setTimeout(connectRabbitMQ, 5000); // Retry after 5 sec
  }
}

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
