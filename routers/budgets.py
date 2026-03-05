#lines 1 - 86 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databasev1 import get_connection
import time

router = APIRouter(prefix="/budgets", tags=["Budgets"])

class BudgetCreate(BaseModel):
    user_id: int
    period_start: str   # YYYY-MM-DD
    period_end: str     # YYYY-MM-DD
    template_id: int | None = None

class BudgetUpdate(BaseModel):
    period_start: str | None = None
    period_end: str | None = None
    template_id: int | None = None

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

@router.get("/")
def list_budgets():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM budgets").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_budget(b: BudgetCreate):
    conn = get_connection()
    ts = now()
    conn.execute(
        """
        INSERT INTO budgets (user_id, period_start, period_end, template_id, created_on, updated_on)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (b.user_id, b.period_start, b.period_end, b.template_id, ts, ts)
    )
    conn.commit()
    conn.close()
    return {"message": "Budget created"}

@router.get("/{budget_id}")
def get_budget(budget_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM budgets WHERE budget_id = ?", (budget_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Budget not found")
    return dict(row)

@router.put("/{budget_id}")
def update_budget(budget_id: int, update: BudgetUpdate):
    conn = get_connection()
    row = conn.execute("SELECT * FROM budgets WHERE budget_id = ?", (budget_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Budget not found")

    current = dict(row)

    new_start = update.period_start or current["period_start"]
    new_end = update.period_end or current["period_end"]
    new_template = update.template_id if update.template_id is not None else current["template_id"]

    conn.execute(
        """
        UPDATE budgets
        SET period_start = ?, period_end = ?, template_id = ?, updated_on = ?
        WHERE budget_id = ?
        """,
        (new_start, new_end, new_template, now(), budget_id)
    )
    conn.commit()
    conn.close()
    return {"message": "Budget updated"}

@router.delete("/{budget_id}")
def delete_budget(budget_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM budgets WHERE budget_id = ?", (budget_id,))
    conn.commit()
    conn.close()
    return {"message": "Budget deleted"}