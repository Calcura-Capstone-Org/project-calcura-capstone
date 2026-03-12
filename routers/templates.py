#lines 1 - 104 written by Emma Wikingstad
from fastapi import APIRouter, HTTPException
from databasev1 import get_connection
from pydantic import BaseModel, field_validator
import time

router = APIRouter(prefix="/templates", tags=["Templates"])

VALID_STAGES = {
    1: "young adult",
    2: "career",
    3: "retirement"
}

class TemplateCreate(BaseModel):
    user_id: int
    name: str
    stage_id: int
    is_default: bool = False

    @field_validator("stage_id")
    def validate_stage(cls, v):
        if v not in VALID_STAGES:
            raise ValueError("stage_id must be 1 (young adult), 2 (career), or 3 (retirement)")
        return v

class TemplateUpdate(BaseModel):
    name: str | None = None
    stage_id: int | None = None
    is_default: bool | None = None

    @field_validator("stage_id")
    def validate_stage(cls, v):
        if v is not None and v not in VALID_STAGES:
            raise ValueError("stage_id must be 1 (young adult), 2 (career), or 3 (retirement)")
        return v

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

@router.get("/")
def list_templates():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM templates").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_template(t: TemplateCreate):
    conn = get_connection()
    ts = now()
    conn.execute(
        """
        INSERT INTO templates (user_id, name, stage_id, is_default, created_on, updated_on)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (t.user_id, t.name, t.stage_id, t.is_default, ts, ts)
    )
    conn.commit()
    conn.close()
    return {"message": f"Template created for stage '{VALID_STAGES[t.stage_id]}'"}

@router.get("/{template_id}")
def get_template(template_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM templates WHERE template_id = ?", (template_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Template not found")
    return dict(row)

@router.put("/{template_id}")
def update_template(template_id: int, update: TemplateUpdate):
    conn = get_connection()
    row = conn.execute("SELECT * FROM templates WHERE template_id = ?", (template_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Template not found")

    current = dict(row)

    new_name = update.name or current["name"]
    new_stage = update.stage_id if update.stage_id is not None else current["stage_id"]
    new_default = update.is_default if update.is_default is not None else current["is_default"]

    conn.execute(
        """
        UPDATE templates
        SET name = ?, stage_id = ?, is_default = ?, updated_on = ?
        WHERE template_id = ?
        """,
        (new_name, new_stage, new_default, now(), template_id)
    )
    conn.commit()
    conn.close()
    return {"message": f"Template updated (stage: {VALID_STAGES[new_stage]})"}

@router.delete("/{template_id}")
def delete_template(template_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM templates WHERE template_id = ?", (template_id,))
    conn.commit()
    conn.close()
    return {"message": "Template deleted"}