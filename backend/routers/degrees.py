from fastapi import APIRouter, Depends
import sqlite3
from database import get_db

router = APIRouter()

@router.get("/degrees")
def get_degrees(db = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM degrees")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@router.get("/degrees/{degree_id}")
def get_degree(degree_id: str, db = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM degrees WHERE degree_id = ?", (degree_id,))
    row = cursor.fetchone()
    if not row:
        return {"error": "Degree not found"}
    return dict(row)