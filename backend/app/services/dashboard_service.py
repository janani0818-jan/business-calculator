from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.models.calculator_history import CalculatorHistory
from backend.app.models.gst_history import GstHistory

class DashboardService:
    @staticmethod
    def get_aggregated_stats(db: Session):
        """
        Coordinates full statistics summary counting systems for the SaaS Dashboard indicators.
        """
        total_calcs = db.query(func.count(CalculatorHistory.id)).scalar() or 0
        total_gst = db.query(func.count(GstHistory.id)).scalar() or 0

        latest_calc = db.query(CalculatorHistory).order_by(CalculatorHistory.id.desc()).first()
        latest_gst = db.query(GstHistory).order_by(GstHistory.id.desc()).first()

        recent_calcs = db.query(CalculatorHistory).order_by(CalculatorHistory.id.desc()).limit(5).all()
        recent_gsts = db.query(GstHistory).order_by(GstHistory.id.desc()).limit(5).all()

        return {
            "total_calculations": total_calcs,
            "total_gst_calculations": total_gst,
            "latest_calculation": latest_calc,
            "latest_gst_calculation": latest_gst,
            "recent_calculations": recent_calcs,
            "recent_gst_calculations": recent_gsts
        }
