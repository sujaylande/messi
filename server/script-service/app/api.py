from fastapi import FastAPI, HTTPException
from app.models import RegisterStudent, AttendanceRequest
from app.db_utils import get_db_connection, insert_student, insert_embedding
from app.rabbitmq_utils import send_registration_event_toManager, send_registration_event_toStudent
import subprocess
import logging
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.face_utils import capture_face
from fastapi import BackgroundTasks


logger = logging.getLogger(__name__)

app = FastAPI()

# Custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "body": await request.body()
        },
    )

def process_registration(data: RegisterStudent):
    try:
        embedding = capture_face()
        conn = get_db_connection()
        insert_student(conn, data.dict())
        insert_embedding(conn, data.reg_no, data.block_no, embedding)
        send_registration_event_toManager(data.dict())
        send_registration_event_toStudent(data.dict())
        conn.close()
    except Exception as e:
        logger.error(f"Error in background registration task: {e}", exc_info=True)


@app.post("/register")
async def register_student(data: RegisterStudent, background_tasks: BackgroundTasks):
    try:
        # Queue the registration logic as a background task
        background_tasks.add_task(process_registration, data)
        return {"message": "Registration started"}
    except Exception as e:
        logger.error(f"Error during registration: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during registration")
    

# @app.post("/register")
# async def register_student(data: RegisterStudent):
#     try:
#         embedding = capture_face()
#         conn = get_db_connection()
#         insert_student(conn, data.dict())
#         insert_embedding(conn, data.reg_no, data.block_no, embedding)
#         send_registration_event_toManager(data.dict())
#         send_registration_event_toStudent(data.dict())
#         conn.close()
#         return {"message": "Registration successful"}
#     except Exception as e:
#         logger.error(f"Error during registration: {e}", exc_info=True) # Log the full exception
#         raise HTTPException(status_code=500, detail="Internal server error during registration")
    

@app.post("/attendance")
async def start_attendance(request: AttendanceRequest):
    try:
        print("Launching worker as module: app.attendance_worker")
        subprocess.Popen(["python", "-m", "app.attendance_worker", request.block_no])
        return {"message": f"Attendance process started for block: {request.block_no}"}
    except Exception as e:
        print("Subprocess error:", e)
        return {"error": str(e)}

