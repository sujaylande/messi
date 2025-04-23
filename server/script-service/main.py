from app.api import app
from app.rabbitmq_utils import start_feedback_consumer

start_feedback_consumer()  # 👈 Start RabbitMQ listener in a background thread

# ... your FastAPI app initialization ...





#uvicorn main:app --reload --host 0.0.0.0 --port 8000
