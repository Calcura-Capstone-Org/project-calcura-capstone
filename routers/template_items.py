#lines 1 - 80 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databasev1 import get_connection
import time

router = APIRouter(prefix="/template_items", tags=["Template Items"])

class TemplateItemCreate(BaseModel):
    template_id: int
    category_id: int
    planned_amt: float

class TemplateItemUpdate(BaseModel):
    planned_amt: float | None = None

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

@router.get("/")
def list_template_items():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM template_items").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_template_item(ti: TemplateItemCreate):
    conn = get_connection()
    ts = now()
    conn.execute(
        """
        INSERT INTO template_items (template_id, category_id, planned_amt, created_on, updated_on)
        VALUES (?, ?, ?, ?, ?)
        """,
        (ti.template_id, ti.category_id, ti.planned_amt, ts, ts)
    )
    conn.commit()
    conn.close()
    return {"message": "Template item created"}

@router.get("/{item_id}")
def get_template_item(item_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM template_items WHERE item_id = ?", (item_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Template item not found")
    return dict(row)

@router.put("/{item_id}")
def update_template_item(item_id: int, update: TemplateItemUpdate):
    conn = get_connection()
    row = conn.execute("SELECT * FROM template_items WHERE item_id = ?", (item_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Template item not found")

    current = dict(row)
    new_amt = update.planned_amt if update.planned_amt is not None else current["planned_amt"]

    conn.execute(
        """
        UPDATE template_items
        SET planned_amt = ?, updated_on = ?
        WHERE item_id = ?
        """,
        (new_amt, now(), item_id)
    )
    conn.commit()
    conn.close()
    return {"message": "Template item updated"}

@router.delete("/{item_id}")
def delete_template_item(item_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM template_items WHERE item_id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"message": "Template item deleted"}