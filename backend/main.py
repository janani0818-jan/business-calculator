import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import engine, Base
from backend.app.routes import calculator, gst, dashboard

# Initialize tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Business Calculator Pro APIs",
    description="Compliance core and billing calculation ledger schemas.",
    version="1.2.4"
)

# Cross-origin policy declarations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount APIRouters under sub-namespaces
app.include_router(calculator.router, prefix="/api/v1")
app.include_router(gst.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")

@app.get("/health", tags=["system"])
def system_health_status():
    """
    Returns API runtime operations status.
    """
    return {"status": "ok", "app": "Business Calculator Pro Core", "api_version": "1.2.4"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
