from fastapi import FastAPI, HTTPException
from app.models import RegisterStudent, AttendanceRequest
from app.db_utils import get_db_connection, insert_student, insert_embedding, get_all_embeddings, get_student_info, has_eaten, insert_attendance
from app.face_utils import capture_face, cosine_similarity, get_current_meal
from app.rabbitmq_utils import send_registration_event, send_attendance_event
from datetime import datetime
import numpy as np

app = FastAPI()

@app.post("/register")
def register_student(data: RegisterStudent):
    try:
        print(data)
        embedding = capture_face()
        conn = get_db_connection()
        insert_student(conn, data.dict())
        insert_embedding(conn, data.reg_no, embedding)
        send_registration_event(data.dict())
        conn.close()
        return {"message": "Registration successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/attendance")
def mark_attendance(request: AttendanceRequest):
    try:
        input_vec = np.array(request.embedding)
        conn = get_db_connection()
        all_embeddings = get_all_embeddings(conn)

        best_match = None
        highest_score = 0.0
        threshold = 0.5

        for reg_no, emb in all_embeddings:
            score = cosine_similarity(input_vec, emb)
            if score > highest_score and score > threshold:
                best_match = reg_no
                highest_score = score

        if not best_match:
            return {"message": "Face not recognized."}

        student = get_student_info(conn, best_match)
        if not student:
            return {"message": "Student info not found."}

        current_slot, cost = get_current_meal()
        if not current_slot:
            return {"message": "Mess is closed now."}

        date_today = datetime.now().strftime("%Y-%m-%d")
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if has_eaten(conn, best_match, student["block_no"], current_slot, date_today):
            return {"message": "You have already eaten."}

        insert_attendance(conn, best_match, student["block_no"], current_slot, cost, timestamp, date_today)

        send_attendance_event({
            "reg_no": best_match,
            "block_no": student["block_no"],
            "meal_slot": current_slot,
            "meal_cost": cost,
            "timestamp": timestamp,
            "date": date_today
        })

        conn.close()
        return {"message": "Attendance marked. Enjoy your meal."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))