from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class GstHistoryBase(BaseModel):
    amount: float = Field(..., gt=0, description="Base transaction amount must be greater than zero.")
    gst_rate: float = Field(..., ge=0, description="GST Rate must be non-negative.")
    gst_type: str = Field(..., description="GST calculation model layout tag.")
    gst_amount: float = Field(..., description="Calculated total tax charge.")
    grand_total: float = Field(..., description="Summary billing inclusive of taxes.")

class GstHistoryCreate(GstHistoryBase):
    pass

class GstHistory(GstHistoryBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
