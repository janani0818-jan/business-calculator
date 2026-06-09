from sqlalchemy.orm import Session
from backend.app.models.gst_history import GstHistory
from backend.app.schemas import gst as schemas

class GstService:
    @staticmethod
    def get_history(db: Session, skip: int = 0, limit: int = 100):
        """
        Fetches chronologically reversed GST tax invoice calculations.
        """
        return db.query(GstHistory).order_by(GstHistory.id.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def create_entry(db: Session, entry: schemas.GstHistoryCreate):
        """
        Saves computed tax parameters into local SQLite database.
        """
        db_record = GstHistory(
            amount=entry.amount,
            gst_rate=entry.gst_rate,
            gst_type=entry.gst_type,
            gst_amount=entry.gst_amount,
            grand_total=entry.grand_total
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return db_record

    @staticmethod
    def delete_entry(db: Session, entry_id: int):
        """
        Deletes a single tax billing document from audit list.
        """
        db_record = db.query(GstHistory).filter(GstHistory.id == entry_id).first()
        if db_record:
            db.delete(db_record)
            db.commit()
            return True
        return False

    @staticmethod
    def clear_all(db: Session):
        """
        Wipes the complete GST ledger database.
        """
        db.query(GstHistory).delete()
        db.commit()
        return True
