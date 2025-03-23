const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {
  try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      console.log("🐇 Manager connected to RabbitMQ!");
      return channel;
  } catch (error) {
      console.error("❌ RabbitMQ Connection Failed:", error);
      setTimeout(connectRabbitMQ, 5000); // Retry after 5 sec
  }
}

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
