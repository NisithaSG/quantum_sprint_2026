from fastapi import APIRouter, Depends
from database import get_db

router = APIRouter()

@router.get("/degree/{degree_id}/graph")
def get_graph(degree_id: str, db = Depends(get_db)):
    return {"message": "graph coming soon", "degree_id": degree_id}