from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.schemas import gst as schemas
from backend.app.services.gst_service import GstService

router = APIRouter(prefix="/gst", tags=["gst-calculator"])

@router.get("/history", response_model=List[schemas.GstHistory])
def read_gst_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return GstService.get_history(db, skip=skip, limit=limit)

@router.post("/history", response_model=schemas.GstHistory, status_code=status.HTTP_201_CREATED)
def create_gst_invoice(entry: schemas.GstHistoryCreate, db: Session = Depends(get_db)):
    return GstService.create_entry(db, entry)

@router.delete("/history/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gst_invoice(id: int, db: Session = Depends(get_db)):
    success = GstService.delete_entry(db, id)
    if not success:
        raise HTTPException(status_code=404, detail=f"GST transaction line {id} not found.")
    return None

@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
def clear_all_gst_invoices(db: Session = Depends(get_db)):
    GstService.clear_all(db)
    return None
