from fastapi import APIRouter, Depends
import sqlite3
from database import get_db

router = APIRouter()

@router.get("/courses")
def get_courses(db = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@router.get("/courses/{course_id}")
def get_course(course_id: str, db = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM courses WHERE course_id = ?", (course_id,))
    row = cursor.fetchone()
    if not row:
        return {"error": "Course not found"}
    return dict(row)