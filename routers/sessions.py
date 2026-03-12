#lines 1 - 55 written by emma wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databasev1 import get_connection
import time

router = APIRouter(prefix="/sessions", tags=["Sessions"])

class SessionCreate(BaseModel):
    user_id: int
    expires_on: str
    ip_address: str | None = None
    user_agent: str | None = None

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

@router.get("/")
def list_sessions():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM Sessions").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_session(s: SessionCreate):
    conn = get_connection()
    issued = now()
    conn.execute(
        """
        INSERT INTO Sessions (user_id, issued_on, expires_on, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
        """,
        (s.user_id, issued, s.expires_on, s.ip_address, s.user_agent)
    )
    conn.commit()
    conn.close()
    return {"message": "Session created"}

@router.get("/{session_id}")
def get_session(session_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM Sessions WHERE session_id = ?", (session_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Session not found")
    return dict(row)

@router.delete("/{session_id}")
def delete_session(session_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM Sessions WHERE session_id = ?", (session_id,))
    conn.commit()
    conn.close()
    return {"message": "Session deleted"}