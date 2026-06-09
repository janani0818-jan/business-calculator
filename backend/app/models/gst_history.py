import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime
from backend.app.database import Base

class GstHistory(Base):
    __tablename__ = "gst_history"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    gst_rate = Column(Float, nullable=False)
    gst_type = Column(String, nullable=False) # 'INCLUSIVE', 'EXCLUSIVE_CGST_SGST', 'EXCLUSIVE_IGST'
    gst_amount = Column(Float, nullable=False)
    grand_total = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
