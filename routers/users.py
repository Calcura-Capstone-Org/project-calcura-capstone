#Lines 1 - 45 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databasev1 import get_connection
import hashlib
import time

router = APIRouter(prefix="/users", tags=["Users"])

#Using Pydantic Model for creation
class UserCreate(BaseModel):
    email: str
    password: str
    age: int

#Helper Functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def now_timestamp() -> str:
    return time.strftime("%Y-%m-%d %H:%M:%S")

#Get Users
@router.get("/")
def list_users():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM Users").fetchall()
    conn.close()
    return [dict(row) for row in rows]

#Create user
@router.post("/")
def create_user(user: UserCreate):
    conn=get_connection()

    password_hash = hash_password(user.password)
    timestamp = now_timestamp()

    conn.execute(
        "INSERT INTO Users (email, password_hash, age, is_active, created_on, updated_on) VALUES (?, ?, ?, ?, ?, ?)",
        (user.email, password_hash, user.age, 1, timestamp, timestamp)
    )
    conn.commit()
    conn.close()
    return {"Message": "User created successfully"}
