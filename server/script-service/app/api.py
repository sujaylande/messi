from fastapi import FastAPI, HTTPException
from app.models import RegisterStudent, AttendanceRequest
from app.db_utils import get_db_connection, insert_student, insert_embedding, get_all_embeddings, get_student_info, has_eaten, insert_attendance
from app.face_utils import capture_face, get_current_meal
from app.rabbitmq_utils import send_registration_event_toManager, send_registration_event_toStudent, send_attendance_event_toManager, send_attendance_event_toStudent
from datetime import datetime
import numpy as np
import logging
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

app = FastAPI()
conn = get_db_connection()

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


@app.post("/register")
async def register_student(data: RegisterStudent):
    try:
        embedding = capture_face()
        print("emb", embedding)
        conn = get_db_connection()
        insert_student(conn, data.dict())
        print("insert st")
        insert_embedding(conn, data.reg_no, data.block_no, embedding)
        print("insert em")
        send_registration_event_toManager(data.dict())
        send_registration_event_toStudent(data.dict())
        conn.close()
        return {"message": "Registration successful"}
    except Exception as e:
        logger.error(f"Error during registration: {e}", exc_info=True) # Log the full exception
        raise HTTPException(status_code=500, detail="Internal server error during registration")
    
# @app.post("/register")
# async def register_student(data: RegisterStudent):
#     try:
#         embedding = capture_face()
#         print("emb", embedding)
#         conn = get_db_connection()
#         insert_student(conn, data.dict())
#         print("insert st")
#         insert_embedding(conn, data.reg_no, data.block_no, embedding)
#         print("insert em")
#         send_registration_event_toManager(data.dict())
#         send_registration_event_toStudent(data.dict())
#         conn.close()
#         return {"message": "Registration successful"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @app.post("/attendance")
# def mark_attendance(request: AttendanceRequest):
#     print(request)
#     try:
#         conn = get_db_connection()
#         # input_vec = np.array(request.embedding)
#         all_embeddings = get_all_embeddings(conn, request.block_no)

#         best_match = None
#         highest_score = 0.0
#         threshold = 0.5

#         for reg_no, emb in all_embeddings:
#             score = cosine_similarity(input_vec, emb)
#             print(score)
#             if score > highest_score and score > threshold:
#                 best_match = reg_no
#                 highest_score = score

#         if not best_match:
#             return {"message": "Face not recognized."}

#         student = get_student_info(conn, best_match)
#         print(student)
#         if not student:
#             return {"message": "Student info not found."}

#         current_slot, cost = get_current_meal()
#         print(current_slot, cost)
#         if not current_slot:
#             return {"message": "Mess is closed now."}

#         date_today = datetime.now().strftime("%Y-%m-%d")
#         timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

#         if has_eaten(conn, best_match, student["block_no"], current_slot, date_today):
#             return {"message": "You have already eaten."}

#         insert_attendance(conn, best_match, student["block_no"], current_slot, cost, timestamp, date_today)

#         send_attendance_event({
#             "reg_no": best_match,
#             "block_no": student["block_no"],
#             "meal_slot": current_slot,
#             "meal_cost": cost,
#             "timestamp": timestamp,
#             "date": date_today
#         })
#         conn.close()
#         return {"message": "Attendance marked. Enjoy your meal."}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
from fastapi import BackgroundTasks
from app.face_utils import get_current_meal

import face_recognition
import cv2
from datetime import datetime
from scipy.spatial import KDTree



@app.post("/attendance")
async def start_attendance(request: AttendanceRequest, background_tasks: BackgroundTasks):
    block_no = request.block_no  # Access the block_no from the request object
    background_tasks.add_task(run_attendance_loop, block_no=block_no) # Pass block_no to your background task
    return {"message": f"Attendance process started for block: {block_no}"}

def run_attendance_loop(block_no: str):
    cap = cv2.VideoCapture(0)
    conn = get_db_connection()
    all_embeddings = get_all_embeddings(conn, block_no)

    if not all_embeddings:
        print("No embeddings found.")
        return

    reg_nos, embeddings = zip(*all_embeddings)
    tree = KDTree(embeddings)

    print("Face recognition loop started...")

    while True:
        ret, frame = cap.read()
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        boxes = face_recognition.face_locations(rgb_frame)
        encodings = face_recognition.face_encodings(rgb_frame, boxes)

        # for encoding in encodings:
            # distance, idx = tree.query(encoding)
            # threshold = 0.45

            # if distance > threshold:
            #     print("Unknown face detected.")
            #     speak("Not registered, you have to pay.")
            #     continue

            # matched_reg_no = reg_nos[idx]
            # student = get_student_info(conn, matched_reg_no, block_no)
            # if not student:
            #     print("Student not found.")
            #     continue

            # current_slot, cost = get_current_meal()
            # if not current_slot:
            #     print("Mess closed.")
            #     speak("Mess is closed, come in the next slot.")
            #     continue

            # date_today = datetime.now().strftime("%Y-%m-%d")
            # timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # if has_eaten(conn, matched_reg_no, student["block_no"], current_slot, date_today):
            #     print(f"{matched_reg_no} already eaten.")
            #     speak("You have already eaten.")
            #     continue

            # insert_attendance(conn, matched_reg_no, student["block_no"], current_slot, cost, timestamp, date_today)

            # send_attendance_event({
            #     "reg_no": matched_reg_no,
            #     "block_no": student["block_no"],
            #     "meal_slot": current_slot,
            #     "meal_cost": cost,
            #     "timestamp": timestamp,
            #     "date": date_today
            # })

            # print(f"Attendance marked for {matched_reg_no} at {timestamp} for {current_slot}.")
            # speak("Enjoy your meal.")

        for (top, right, bottom, left), encoding in zip(boxes, encodings):
            distance, idx = tree.query(encoding)
            threshold = 0.45

            if distance > threshold:
                print("Unknown face detected.")
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                cv2.putText(frame, "Unknown", (left, top - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                continue

            matched_reg_no = reg_nos[idx]
            student = get_student_info(conn, matched_reg_no, block_no)
            if not student:
                print("Student not found.")
                continue

            name_label = f"{student['reg_no']} - {student['name']}"
            # Draw bounding box and name
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(frame, name_label, (left, top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            current_slot, cost = get_current_meal()
            if not current_slot:
                print("Mess closed.")
                continue

            date_today = datetime.now().strftime("%Y-%m-%d")
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if has_eaten(conn, matched_reg_no, student["block_no"], current_slot, date_today):
                print(f"{matched_reg_no} already eaten.")
                continue

            insert_attendance(conn, matched_reg_no, student["block_no"], current_slot, cost, timestamp, date_today)

            send_attendance_event_toStudent({
                "reg_no": matched_reg_no,
                "block_no": student["block_no"],
                "meal_slot": current_slot,
                "meal_cost": cost,
                "timestamp": timestamp,
                "date": date_today
            })

            send_attendance_event_toManager({
                "reg_no": matched_reg_no,
                "block_no": student["block_no"],
                "meal_slot": current_slot,
                "meal_cost": cost,
                "timestamp": timestamp,
                "date": date_today
            })

            print(f"Attendance marked for {matched_reg_no} at {timestamp} for {current_slot}.")


        cv2.imshow("Live Attendance", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    conn.close()
