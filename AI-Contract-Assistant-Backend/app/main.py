from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.documents import router as documents_router
from app.api.qa import router as qa_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Contract Assistant API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(qa_router)

@app.get("/")
def root():
    return {
        "message": "AI Contract Assistant Backend is running!"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
