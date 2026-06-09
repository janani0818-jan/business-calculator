from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CalculatorHistoryBase(BaseModel):
    expression: str
    result: str

class CalculatorHistoryCreate(CalculatorHistoryBase):
    pass

class CalculatorHistory(CalculatorHistoryBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
