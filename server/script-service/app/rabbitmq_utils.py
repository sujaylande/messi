import pika
import json
import os

amqp_url = os.getenv("AMQP_URL")
params = pika.URLParameters(amqp_url)
params.heartbeat = 600
params.blocked_connection_timeout = 300

connection = pika.BlockingConnection(params)
channel = connection.channel()
channel.queue_declare(queue='register_student_queue', durable=True)
channel.queue_declare(queue='attendance_queue', durable=True)

def send_registration_event(payload):
    channel.basic_publish(
        exchange='',
        routing_key='register_student_queue',
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2)
    )

def send_attendance_event(payload):
    channel.basic_publish(
        exchange='',
        routing_key='attendance_queue',
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2)
    )

