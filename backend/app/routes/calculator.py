from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.schemas import calculator as schemas
from backend.app.services.calculator_service import CalculatorService

router = APIRouter(prefix="/calculator", tags=["standard-calculator"])

@router.get("/history", response_model=List[schemas.CalculatorHistory])
def read_calculator_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return CalculatorService.get_history(db, skip=skip, limit=limit)

@router.post("/history", response_model=schemas.CalculatorHistory, status_code=status.HTTP_201_CREATED)
def create_calculator_record(entry: schemas.CalculatorHistoryCreate, db: Session = Depends(get_db)):
    return CalculatorService.create_entry(db, entry)

@router.delete("/history/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_calculator_record(id: int, db: Session = Depends(get_db)):
    success = CalculatorService.delete_entry(db, id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Calculator history record {id} not found.")
    return None

@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
def clear_all_calculator_records(db: Session = Depends(get_db)):
    CalculatorService.clear_all(db)
    return None
