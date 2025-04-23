import pika
import json
import os
# ... your FastAPI app initialization ...
from dotenv import load_dotenv
load_dotenv()

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