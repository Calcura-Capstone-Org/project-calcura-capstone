# Lines 1 - 22 written by Emma Wikingstad
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

@app.get("/")
def root():
    return {"message": "Welcome to the Calcura API"}

# To run the app, use the command: uvicorn testapp:app --reload
# If this command does not work, use "python -m uvicorn testapp:app --reload" instead
# http://127.0.0.1:8000/docs#/ to access the API documentation and test the endpoints.

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)