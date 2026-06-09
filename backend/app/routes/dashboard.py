from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard-analytics"])

@router.get("/stats")
def read_dashboard_overview(db: Session = Depends(get_db)):
    return DashboardService.get_aggregated_stats(db)
