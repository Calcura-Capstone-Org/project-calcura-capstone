# Site content management router - Features and templates descriptions
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from databasev1 import get_connection
import time

router = APIRouter(prefix="/content", tags=["Content"])

class Feature(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    icon: str

class FeatureUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None

class TemplateDescription(BaseModel):
    id: Optional[str] = None
    stage_id: int
    stage_name: str
    description: str

class TemplateDescriptionUpdate(BaseModel):
    stage_name: Optional[str] = None
    description: Optional[str] = None

def init_content_tables():
    """Initialize content tables if they don't exist"""
    conn = get_connection()
    try:
        # Create page content table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS page_content (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                hero_title TEXT NOT NULL,
                hero_subtitle TEXT NOT NULL,
                about_text TEXT NOT NULL,
                features_title TEXT NOT NULL,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )
        """)
        
        # Create features table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS site_features (
                feature_id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                icon TEXT NOT NULL,
                display_order INTEGER,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )
        """)
        
        # Create template descriptions table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS template_descriptions (
                id TEXT PRIMARY KEY,
                stage_id INTEGER NOT NULL UNIQUE,
                stage_name TEXT NOT NULL,
                description TEXT NOT NULL,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )
        """)
        
        conn.commit()
        
        # Initialize default page content if table is empty
        content_count = conn.execute("SELECT COUNT(*) as count FROM page_content").fetchone()["count"]
        if content_count == 0:
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            conn.execute(
                """INSERT INTO page_content (id, hero_title, hero_subtitle, about_text, features_title, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (1, 
                 "Take Control of Your Financial Future",
                 "AI-powered budgeting that adapts to your life stage",
                 "Calcura is a comprehensive financial planning tool designed to help you achieve your financial goals.",
                 "Smart Features for Smart Budgeting",
                 timestamp, timestamp)
            )
        
        # Initialize default features if table is empty
        features_count = conn.execute("SELECT COUNT(*) as count FROM site_features").fetchone()["count"]
        if features_count == 0:
            default_features = [
                ("feature_1", "Recommended Budget", "Get a recommended budget using your own information and tested financial principles", "BarChart3", 1),
                ("feature_2", "Goal Setting", "Set a financial goal and we will calculate what you need to do to achieve it", "Calendar", 2),
                ("feature_3", "Goal Seek Budgeting", "Get a budget recommendation to achieve a specific financial goal", "Search", 3),
            ]
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            for feature_id, title, description, icon, order in default_features:
                conn.execute(
                    """INSERT INTO site_features (feature_id, title, description, icon, display_order, created_at, updated_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (feature_id, title, description, icon, order, timestamp, timestamp)
                )
        
        # Initialize default templates if table is empty
        templates_count = conn.execute("SELECT COUNT(*) as count FROM template_descriptions").fetchone()["count"]
        if templates_count == 0:
            default_templates = [
                ("template_1", 1, "Young Adult", "Get a recommended budget tailored for young adults starting their financial journey"),
                ("template_2", 2, "Career", "Get a recommended budget tailored for career professionals"),
                ("template_3", 3, "Retirement", "Get a recommended budget tailored for retirement planning"),
            ]
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            for template_id, stage_id, stage_name, description in default_templates:
                conn.execute(
                    """INSERT INTO template_descriptions (id, stage_id, stage_name, description, created_at, updated_at)
                       VALUES (?, ?, ?, ?, ?, ?)""",
                    (template_id, stage_id, stage_name, description, timestamp, timestamp)
                )
        
        conn.commit()
    finally:
        conn.close()

# Initialize tables on module import
init_content_tables()

# Page Content endpoints
@router.get("/page-content")
def get_page_content():
    """Get page content"""
    conn = get_connection()
    try:
        row = conn.execute("SELECT hero_title, hero_subtitle, about_text, features_title FROM page_content WHERE id = 1").fetchone()
        if not row:
            return {
                "hero_title": "Take Control of Your Financial Future",
                "hero_subtitle": "AI-powered budgeting that adapts to your life stage",
                "about_text": "Calcura is a comprehensive financial planning tool designed to help you achieve your financial goals.",
                "features_title": "Smart Features for Smart Budgeting"
            }
        return dict(row)
    finally:
        conn.close()

@router.put("/page-content")
def update_page_content(content: dict):
    """Update page content"""
    conn = get_connection()
    try:
        hero_title = content.get("hero_title")
        hero_subtitle = content.get("hero_subtitle")
        about_text = content.get("about_text")
        features_title = content.get("features_title")
        
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        
        conn.execute(
            """UPDATE page_content SET 
               hero_title = ?, hero_subtitle = ?, about_text = ?, 
               features_title = ?, updated_at = ? WHERE id = 1""",
            (hero_title, hero_subtitle, about_text, features_title, timestamp)
        )
        conn.commit()
        return {"message": "Page content updated successfully"}
    finally:
        conn.close()

# Feature endpoints
@router.get("/features")
def get_features():
    """Get all features with descriptions"""
    conn = get_connection()
    try:
        rows = conn.execute("SELECT feature_id, title, description, icon FROM site_features ORDER BY display_order").fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()

@router.get("/features/{feature_id}")
def get_feature(feature_id: str):
    """Get a specific feature"""
    conn = get_connection()
    try:
        row = conn.execute("SELECT feature_id, title, description, icon FROM site_features WHERE feature_id = ?", (feature_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Feature not found")
        return dict(row)
    finally:
        conn.close()

@router.put("/features/{feature_id}")
def update_feature(feature_id: str, feature: FeatureUpdate):
    """Update a feature description"""
    conn = get_connection()
    try:
        existing = conn.execute("SELECT 1 FROM site_features WHERE feature_id = ?", (feature_id,)).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Feature not found")
        
        update_fields = []
        update_values = []
        
        if feature.title is not None:
            update_fields.append("title = ?")
            update_values.append(feature.title)
        
        if feature.description is not None:
            update_fields.append("description = ?")
            update_values.append(feature.description)
        
        if feature.icon is not None:
            update_fields.append("icon = ?")
            update_values.append(feature.icon)
        
        update_fields.append("updated_at = ?")
        update_values.append(time.strftime("%Y-%m-%d %H:%M:%S"))
        update_values.append(feature_id)
        
        conn.execute(
            f"UPDATE site_features SET {', '.join(update_fields)} WHERE feature_id = ?",
            update_values
        )
        conn.commit()
        return {"message": "Feature updated successfully"}
    finally:
        conn.close()

# Template description endpoints
@router.get("/templates")
def get_template_descriptions():
    """Get all template descriptions"""
    conn = get_connection()
    try:
        rows = conn.execute("SELECT id, stage_id, stage_name, description FROM template_descriptions ORDER BY stage_id").fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()

@router.get("/templates/{template_id}")
def get_template_description(template_id: str):
    """Get a specific template description"""
    conn = get_connection()
    try:
        row = conn.execute("SELECT id, stage_id, stage_name, description FROM template_descriptions WHERE id = ?", (template_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Template description not found")
        return dict(row)
    finally:
        conn.close()

@router.put("/templates/{template_id}")
def update_template_description(template_id: str, template: TemplateDescriptionUpdate):
    """Update a template description"""
    conn = get_connection()
    try:
        existing = conn.execute("SELECT 1 FROM template_descriptions WHERE id = ?", (template_id,)).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Template description not found")
        
        update_fields = []
        update_values = []
        
        if template.stage_name is not None:
            update_fields.append("stage_name = ?")
            update_values.append(template.stage_name)
        
        if template.description is not None:
            update_fields.append("description = ?")
            update_values.append(template.description)
        
        update_fields.append("updated_at = ?")
        update_values.append(time.strftime("%Y-%m-%d %H:%M:%S"))
        update_values.append(template_id)
        
        conn.execute(
            f"UPDATE template_descriptions SET {', '.join(update_fields)} WHERE id = ?",
            update_values
        )
        conn.commit()
        return {"message": "Template description updated successfully"}
    finally:
        conn.close()
