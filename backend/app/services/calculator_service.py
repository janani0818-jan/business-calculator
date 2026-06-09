from sqlalchemy.orm import Session
from backend.app.models.calculator_history import CalculatorHistory
from backend.app.schemas import calculator as schemas

class CalculatorService:
    @staticmethod
    def get_history(db: Session, skip: int = 0, limit: int = 100):
        """
        Fetches calculations list chronologically reversed.
        """
        return db.query(CalculatorHistory).order_by(CalculatorHistory.id.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def create_entry(db: Session, entry: schemas.CalculatorHistoryCreate):
        """
        Inserts standard mathematical equation evaluation result in database.
        """
        db_record = CalculatorHistory(
            expression=entry.expression,
            result=entry.result
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return db_record

    @staticmethod
    def delete_entry(db: Session, entry_id: int):
        """
        Deletes a single computation record.
        """
        db_record = db.query(CalculatorHistory).filter(CalculatorHistory.id == entry_id).first()
        if db_record:
            db.delete(db_record)
            db.commit()
            return True
        return False

    @staticmethod
    def clear_all(db: Session):
        """
        Truncates the computations ledger.
        """
        db.query(CalculatorHistory).delete()
        db.commit()
        return True
