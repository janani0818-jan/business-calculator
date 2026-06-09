import datetime
from sqlalchemy import Column, Integer, String, DateTime
from backend.app.database import Base

class CalculatorHistory(Base):
    __tablename__ = "calculator_history"

    id = Column(Integer, primary_key=True, index=True)
    expression = Column(String, nullable=False)
    result = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
