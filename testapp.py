from fastapi import FastAPI
from routers import users, roles, permissions, user_roles, budgets, sessions, categories, templates, template_items

app = FastAPI()
app.include_router(users.router)
app.include_router(roles.router)
app.include_router(permissions.router)
app.include_router(user_roles.router)
app.include_router(budgets.router)
app.include_router(sessions.router)
app.include_router(categories.router)
app.include_router(templates.router)
app.include_router(template_items.router)