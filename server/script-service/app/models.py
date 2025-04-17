from pydantic import BaseModel
from typing import Optional

class RegisterStudent(BaseModel):
    name: str
    email: str
    reg_no: str
    roll_no: str
    block_no: str
    password: str

class AttendanceRequest(BaseModel):
    embedding: list[float]