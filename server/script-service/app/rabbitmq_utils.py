import pika
import json
import os
# ... your FastAPI app initialization ...
from dotenv import load_dotenv
load_dotenv()
from app.db_utils import get_db_connection
import threading


amqp_url = os.getenv("AMQP_URL")
params = pika.URLParameters(amqp_url)
params.heartbeat = 600
params.blocked_connection_timeout = 300

connection = pika.BlockingConnection(params)
channel = connection.channel()
channel.queue_declare(queue='register_student_queue_for_manager', durable=True)
channel.queue_declare(queue='attendance_queue_for_student', durable=True)
channel.queue_declare(queue='register_student_queue_for_student', durable=True)
channel.queue_declare(queue='attendance_queue_for_manager', durable=True)
channel.queue_declare(queue='register_status_queue_for_manager', durable=True)


def send_registration_event_toManager(payload):
    print("to manager")
    channel.basic_publish(
        exchange='',
        routing_key='register_student_queue_for_manager',
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2)
    )

def send_registration_event_toStudent(payload):
    print("tostudent")
    channel.basic_publish(
        exchange='',
        routing_key='register_student_queue_for_student',
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2)
    )

def send_attendance_event_toStudent(payload):
    channel.basic_publish(
        exchange='',
        routing_key='attendance_queue_for_student',
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2)
    )

def send_attendance_event_toManager(payload):
    channel.basic_publish(
        exchange='',
        routing_key='attendance_queue_for_manager',
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2)
    )

def send_registration_Status_toManager(payload):
    print("to manager status")
    channel.basic_publish(
        exchange='',
        routing_key='register_status_queue_for_manager',
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2)
    )


def start_feedback_consumer():
    def feedback_callback(ch, method, properties, body):
        try:
            data = json.loads(body.decode())
            print("📥 Received feedback in script service:", data)

            conn = get_db_connection()
            cursor = conn.cursor()

            insert_query = """
                INSERT INTO feedback (
                    reg_no, block_no, meal_type,
                    taste_rating, hygiene_rating, quantity_rating,
                    want_change, comments, feedback_date
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, CURDATE())
            """

            cursor.execute(insert_query, (
                data['reg_no'],
                data['block_no'],
                data['meal_type'],
                data['taste'],
                data['hygiene'],
                data['quantity'],
                data.get('want_change', ''),
                data.get('comments', '')
            ))

            conn.commit()
            cursor.close()
            conn.close()

            print("✅ Stored feedback to script DB.")
            ch.basic_ack(delivery_tag=method.delivery_tag)

        except Exception as e:
            print("❌ Error processing feedback:", str(e))

    def run():
        try:
            channel.queue_declare(queue='feedback_queue_for_scipt_service', durable=True)
            channel.basic_consume(
                queue='feedback_queue_for_scipt_service',
                on_message_callback=feedback_callback
            )
            print("🚀 RabbitMQ consumer started in background thread")
            channel.start_consuming()
        except Exception as e:
            print("❌ Consumer thread error:", e)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
