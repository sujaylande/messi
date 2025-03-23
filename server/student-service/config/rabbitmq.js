const amqp = require("amqplib");
const db = require("./db");

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue("notice_queue");
    await channel.assertQueue("menu_queue");

    console.log("📌 Student connected to RabbitMQ...");
        
    // Listening for Notice Updates
    channel.consume("notice_queue", async (msg) => {
      if (msg !== null) {
        const notice = JSON.parse(msg.content.toString());
        // console.log("📢 Received Notice from queue:", notice);

        db.query(
            "INSERT INTO notice_board (notice) VALUES (?)",
            [notice.notice], // Fix JSON parsing
            (err, result) => {
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
        // console.log("🍽️ Received Menu from queue:", menuData);

        db.query(
            "INSERT INTO menu (items, img_url, meal_slot, timestamp) VALUES (?, ?, ?, NOW())",
            [menuData.items, menuData.img_url, menuData.meal_slot],
            (err, result) => {
                if (err) console.error("Error inserting menu:", err.message);
                else console.log("✅ Menu saved in Student Database.");
            }
        );

        channel.ack(msg);
      }
    });

    //Listening for attendance

  } catch (error) {
    console.error("🚨 RabbitMQ Connection Error:", error);
  }
}

module.exports = { connectRabbitMQ };
