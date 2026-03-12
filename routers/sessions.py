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

#Login Endpoint

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    conn = get_connection()

    # 1. Look up the user by email
    user = conn.execute(
        "SELECT * FROM Users WHERE email = ?",
        (data.email,)
    ).fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 2. Verify password hash
    import hashlib
    password_hash = hashlib.sha256(data.password.encode()).hexdigest()

    if password_hash != user["password_hash"]:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 3. Create a new session
    issued_on = now()
    expires_on = "2099-12-31 23:59:59"   # or whatever you prefer

    conn.execute(
        """
        INSERT INTO Sessions (user_id, issued_on, expires_on, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
        """,
        (user["user_id"], issued_on, expires_on, None, None)
    )
    conn.commit()

    # 4. Get the session ID
    session_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    conn.close()

    return {
        "message": "Login successful",
        "session_id": session_id,
        "user_id": user["user_id"]
    }