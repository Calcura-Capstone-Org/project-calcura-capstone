#lines 1-40 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databasev1 import get_connection
import time

router = APIRouter(prefix="/roles", tags=["Roles"])

class RoleCreate(BaseModel):
    name: str
    description: str | None = None
    permissions: str | None = None

class RoleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    permissions: str | None = None

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

@router.get("/")
def list_roles():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM Roles").fetchall()
    conn.close()
    return [dict(row) for row in rows]

@router.post("/")
def create_role(role: RoleCreate):
    conn = get_connection()
    timestamp = now()
    conn.execute(
        "INSERT INTO Roles (name, description, permissions, created_on, updated_on) VALUES (?, ?, ?, ?, ?)",
        (role.name, role.description, role.permissions, timestamp, timestamp)
    )
    conn.commit()
    conn.close()
    return {"Message": "Role created successfully"}

