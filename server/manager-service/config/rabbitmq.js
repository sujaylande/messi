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

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue("feedback_queue"); // Listening for feedback
    console.log("🐇 Manager connected to RabbitMQ!");

    // Listening for feedback submissions
    channel.consume("feedback_queue", async (msg) => {
      if (msg !== null) {
        const feedbackData = JSON.parse(msg.content.toString());
        // console.log("📥 Received feedback from Student Service:", feedbackData);

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

    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ Connection Failed:", error);
    setTimeout(connectRabbitMQ, 5000); // Retry after 5 sec
  }
}

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
