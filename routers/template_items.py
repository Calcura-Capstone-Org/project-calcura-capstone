#lines 1 - 80 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databasev1 import get_connection
import time
import threading

_item_id_lock = threading.Lock()

router = APIRouter(prefix="/template_items", tags=["Template Items"])

class TemplateItemCreate(BaseModel):
    template_id: int
    category_id: int
    planned_amt: float
    item_name: str | None = None

class TemplateItemUpdate(BaseModel):
    planned_amt: float | None = None
    item_name: str | None = None

def ensure_item_name_column():
    conn = get_connection()
    cols = [row[1] for row in conn.execute("PRAGMA table_info(template_items)").fetchall()]
    if "item_name" not in cols:
        conn.execute("ALTER TABLE template_items ADD COLUMN item_name TEXT")
        conn.commit()
    conn.close()

ensure_item_name_column()

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

@router.get("/")
def list_template_items():
    conn = get_connection()
    try:
        rows = conn.execute("SELECT * FROM template_items").fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

@router.post("/")
def create_template_item(ti: TemplateItemCreate):
    with _item_id_lock:
        conn = get_connection()
        try:
            ts = now()
            existing = conn.execute("SELECT MAX(item_id) FROM template_items").fetchone()
            next_item_id = (existing[0] or 0) + 1
            conn.execute(
                """
                INSERT INTO template_items (item_id, template_id, category_id, planned_amt, item_name, created_on, updated_on)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (next_item_id, ti.template_id, ti.category_id, ti.planned_amt, ti.item_name, ts, ts)
            )
            conn.commit()
            return {"message": "Template item created", "item_id": next_item_id}
        finally:
            conn.close()

@router.get("/{item_id}")
def get_template_item(item_id: int):
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM template_items WHERE item_id = ?", (item_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Template item not found")
        return dict(row)
    finally:
        conn.close()

@router.put("/{item_id}")
def update_template_item(item_id: int, update: TemplateItemUpdate):
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM template_items WHERE item_id = ?", (item_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Template item not found")

        current = dict(row)
        new_amt = update.planned_amt if update.planned_amt is not None else current["planned_amt"]
        new_name = update.item_name if update.item_name is not None else current.get("item_name")

        conn.execute(
            """
            UPDATE template_items
            SET planned_amt = ?, item_name = ?, updated_on = ?
            WHERE item_id = ?
            """,
            (new_amt, new_name, now(), item_id)
        )
        conn.commit()
        return {"message": "Template item updated"}
    finally:
        conn.close()

@router.delete("/{item_id}")
def delete_template_item(item_id: int):
    conn = get_connection()
    try:
        conn.execute("DELETE FROM template_items WHERE item_id = ?", (item_id,))
        conn.commit()
        return {"message": "Template item deleted"}
    finally:
        conn.close()