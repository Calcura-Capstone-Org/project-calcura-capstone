#Lines 1 - 41 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databasev1 import get_connection
import time

router = APIRouter(prefix="/permissions", tags=["Permissions"])

class PermissionCreate(BaseModel):
    permission_id: str
    name: str
    description: str | None = None

class PermissionUpdate(BaseModel):
    name: str | None = None
    description: str | None = None

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

@router.get("/")
def list_permissions():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM Permissions").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_permission(p: PermissionCreate):
    conn = get_connection()
    ts = now()
    conn.execute(
        """
        INSERT INTO Permissions (permission_id, name, description, created_on, updated_on)
        VALUES (?, ?, ?, ?, ?)
        """,
        (p.permission_id, p.name, p.description, ts, ts)
    )
    conn.commit()
    conn.close()
    return {"message": "Permission created"}