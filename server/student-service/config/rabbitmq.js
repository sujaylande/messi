const amqp = require("amqplib");
const db = require("./db");

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    await channel.assertQueue("notice_queue");
    await channel.assertQueue("menu_queue");
    await channel.assertQueue("attendance_queue_for_student");
    await channel.assertQueue("register_student_queue_for_student");
    await channel.assertQueue("delete_student_queue_for_student");
    await channel.assertQueue("remove_notice_queue");

    console.log("📌 Student connected to RabbitMQ...");

    // Listening for Notice Updates
    channel.consume("notice_queue", async (msg) => {
      if (msg !== null) {
        const notice = JSON.parse(msg.content.toString());

        if (notice.secret !== process.env.SHARED_SECRET) {
          console.warn("❌ Unauthorized message ignored.");
          return channel.ack(msg);
        }
    
        delete notice.secret;

        db.query(
          "INSERT INTO notice_board (notice, block_no) VALUES (?, ?)",
          [notice.notice, notice.block_no],
          (err) => {
            if (err) console.error("Error inserting notice:", err.message);
            else console.log("✅ Notice saved in Student Database.");
          }
        );

        channel.ack(msg);
      }
    });

    // Listening for Menu Updates
    channel.consume("menu_queue", async (msg) => {
      if (msg !== null) {
        const menuData = JSON.parse(msg.content.toString());

        if (menuData.secret !== process.env.SHARED_SECRET) {
          console.warn("❌ Unauthorized message ignored.");
          return channel.ack(msg);
        }
    
        delete menuData.secret;
         

        db.query(
          "INSERT INTO menu (items, img_url, meal_slot, timestamp, block_no) VALUES (?, ?, ?, NOW(), ?)",
          [menuData.items, menuData.img_url, menuData.meal_slot, menuData.block_no],
          (err) => {
            if (err) console.error("Error inserting menu:", err.message);
            // else console.log("✅ Menu saved in Student Database.");
          }
        );

        channel.ack(msg);
      }
    });

    // Listening for attendance Updates
    // channel.consume("attendance_queue_for_student", async (msg) => {
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

    channel.consume("attendance_queue_for_student", async (msg) => {
  if (msg !== null) {
    const attendanceData = JSON.parse(msg.content.toString());

    console.log(attendanceData);

    if (attendanceData.secret !== process.env.SHARED_SECRET) {
      console.warn("❌ Unauthorized message ignored.");
      return channel.ack(msg);
    }

    delete attendanceData.secret;

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
        else console.log("✅ attendance saved in Student DB.");
      }
    );

    channel.ack(msg);
  }
    });

     // Listening for attendance Updates
    channel.consume("register_student_queue_for_student", async (msg) => {
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
                 else console.log("✅ student saved in student Database.");
               }
             );
     
             channel.ack(msg);
           }
    });

    channel.consume("delete_student_queue_for_student", async (msg) => {
      if (msg !== null) {
        const deleteData = JSON.parse(msg.content.toString());
    
        console.log(deleteData);

        if (deleteData.secret !== process.env.SHARED_SECRET) {
          console.warn("❌ Unauthorized message ignored.");
          return channel.ack(msg);
        }
    
        delete deleteData.secret;
    
        // Delete from students table
        db.query(
          "DELETE FROM students WHERE reg_no = ? AND block_no = ?;",
          [deleteData.reg_no, deleteData.block_no],
          (err) => {
            if (err) {
              console.error("❌ Error deleting student:", err.message);
            } else {
              console.log("✅ Student deleted from Student Database.");
    
            }
          }
        );
    
        channel.ack(msg);
      }
    });
    
    channel.consume("remove_notice_queue", async (msg) => {
      if (msg !== null) {
        const deleteData = JSON.parse(msg.content.toString());
    
        console.log(deleteData);

        if (deleteData.secret !== process.env.SHARED_SECRET) {
          console.warn("❌ Unauthorized message ignored.");
          return channel.ack(msg);
        }
    
        delete deleteData.secret;
    
        // Delete from students table
        db.query(
          "DELETE FROM notice_board WHERE id = ? AND block_no = ?;",
          [deleteData.id, deleteData.block_no],
          (err) => {
            if (err) {
              console.error("❌ Error deleting student:", err.message);
            } else {
              console.log("✅ notice deleted from Student Database.");
            }
          }
        );
    
        channel.ack(msg);
      }
    });
    

  } catch (error) {
    console.error("🚨 RabbitMQ Connection Error:", error);
  }
}

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
