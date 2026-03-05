#lines 1 - 103 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from databasev1 import get_connection
import time

router = APIRouter(prefix="/categories", tags=["Categories"])

VALID_CATEGORY_TYPES = {
    "income",
    "expenses",
    "savings",
    "investments",
    "debt",
    "retirement"
}

class CategoryCreate(BaseModel):
    user_id: int
    name: str
    type: str

    @field_validator("type")
    def validate_type(cls, v):
        if v not in VALID_CATEGORY_TYPES:
            raise ValueError("Type must be one of the following: income, expenses, savings, investments, debt, retirement")
        return v

class CategoryUpdate(BaseModel):
    name: str | None = None
    type: str | None = None

    @field_validator("type")
    def validate_type(cls, v):
        if v is not None and v not in VALID_CATEGORY_TYPES:
            raise ValueError("Type must be one of the following: income, expenses, savings, investments, debt, retirement")
        return v

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

@router.get("/")
def list_categories():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM categories").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_category(c: CategoryCreate):
    conn = get_connection()
    ts = now()
    conn.execute(
        """
        INSERT INTO categories (user_id, name, type, created_on, updated_on)
        VALUES (?, ?, ?, ?, ?)
        """,
        (c.user_id, c.name, c.type, ts, ts)
    )
    conn.commit()
    conn.close()
    return {"message": f"Category '{c.name}' created under '{c.type}'"}

@router.get("/{category_id}")
def get_category(category_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM categories WHERE category_id = ?", (category_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Category not found")
    return dict(row)

@router.put("/{category_id}")
def update_category(category_id: int, update: CategoryUpdate):
    conn = get_connection()
    row = conn.execute("SELECT * FROM categories WHERE category_id = ?", (category_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Category not found")

    current = dict(row)
    new_name = update.name or current["name"]
    new_type = update.type or current["type"]

    conn.execute(
        """
        UPDATE categories
        SET name = ?, type = ?, updated_on = ?
        WHERE category_id = ?
        """,
        (new_name, new_type, now(), category_id)
    )
    conn.commit()
    conn.close()
    return {"message": f"Category updated to '{new_name}' ({new_type})"}

@router.delete("/{category_id}")
def delete_category(category_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM categories WHERE category_id = ?", (category_id,))
    conn.commit()
    conn.close()
    return {"message": "Category deleted"}