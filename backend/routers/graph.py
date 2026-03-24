from fastapi import APIRouter, Depends
import sqlite3
from database import get_db
import json

router = APIRouter()

@router.get("/degrees/{degree_id}/graph")
def get_graph(degree_id: str, db = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM sections WHERE degree_id = ?", (degree_id,))
    sections = cursor.fetchall()
    nodes = []
    for section in sections:
        course_ids = json.loads(section["courses"])  # stored as JSON string
        for course_id in course_ids:
            cursor.execute("SELECT * FROM courses WHERE course_id = ?", (course_id,))
            course = cursor.fetchone()
            if course:
                nodes.append({
                    "id": course["course_id"],
                    "name": course["name"],
                    "hours": course["hours"],
                    "section": section["section_name"]
            })
                
    edges = []
    for node in nodes:
        cursor.execute("SELECT prereq_parsed FROM courses WHERE course_id = ?", (node["id"],))
        row = cursor.fetchone()
        if not row or not row["prereq_parsed"]:
            continue
        prereq = json.loads(row["prereq_parsed"])
        if prereq and prereq.get("has_courses"):
            for req_course in prereq["courses"]:
                edges.append({
                "source": req_course,
                "target": node["id"]
            })
    return {
    "degree_id": degree_id,
    "nodes": nodes,
    "edges": edges
}
    


