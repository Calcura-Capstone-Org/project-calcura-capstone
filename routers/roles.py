#lines 1-40 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databasev1 import get_connection
import time

router = APIRouter(prefix="/roles", tags=["Roles"])

class RoleCreate(BaseModel):
    role_id: int | None = None
    name: str
    description: str | None = None
    permissions: str | None = None

class RoleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    permissions: str | None = None

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

def get_role_columns(conn):
    rows = conn.execute("PRAGMA table_info(Roles)").fetchall()
    return {row[1].lower() for row in rows}

@router.get("/")
def list_roles():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM Roles").fetchall()
    conn.close()
    return [dict(row) for row in rows]

@router.post("/")
def create_role(role: RoleCreate):
    conn = get_connection()
    columns = get_role_columns(conn)

    if "name" not in columns:
                conn.close()
                raise HTTPException(status_code=500, detail="Roles table missing required 'name' column")

    timestamp = now()
    insert_columns: list[str] = ["name"]
    values: list[object] = [role.name]

    if role.role_id is not None and "role_id" in columns:
        insert_columns.insert(0, "role_id")
        values.insert(0, role.role_id)

    if "description" in columns:
        insert_columns.append("description")
        values.append(role.description)

    if "permissions" in columns:
        insert_columns.append("permissions")
        values.append(role.permissions)

    if "created_on" in columns:
        insert_columns.append("created_on")
        values.append(timestamp)

    if "updated_on" in columns:
        insert_columns.append("updated_on")
        values.append(timestamp)

    placeholders = ", ".join(["?" for _ in insert_columns])
    column_sql = ", ".join(insert_columns)
    conn.execute(f"INSERT INTO Roles ({column_sql}) VALUES ({placeholders})", tuple(values))
    conn.commit()
    conn.close()
    return {"Message": "Role created successfully"}

