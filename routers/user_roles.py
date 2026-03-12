#lines 1-35 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databasev1 import get_connection
import time

router = APIRouter(prefix="/user_roles", tags=["User Roles"])

class UserRoleCreate(BaseModel):
    user_id: int
    role_id: int

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

@router.get("/")
def list_user_roles():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM User_Roles").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def assign_role(ur: UserRoleCreate):
    conn = get_connection()
    conn.execute(
        """
        INSERT INTO User_Roles (user_id, role_id, updated_on)
        VALUES (?, ?, ?)
        """,
        (ur.user_id, ur.role_id, now())
    )
    conn.commit()
    conn.close()
    return {"message": "Role assigned to user"}