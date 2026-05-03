from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClassSession(BaseModel):
    id: int
    subject: str
    professor: str
    room: str
    day: str
    start_time: str
    end_time: str

@app.get("/")
def read_root():
    return {"status": "online", "message": "¡Servidor Python funcionando!"}

@app.get("/api/schedule", response_model=List[ClassSession])
def get_schedule():
    return[
        {"id": 1, "subject": "IA", "professor": "Dr. Alan", "room": "Lab 4", "day": "Lunes", "start_time": "08:00", "end_time": "10:30"},
        {"id": 2, "subject": "Web", "professor": "Ing. Ada", "room": "Aula 1", "day": "Miércoles", "start_time": "11:00", "end_time": "13:00"}
    ]
