from fastapi import APIRouter, Depends
from app.services.db import item_store
from app.services.db import user_store
from app.services.db import report_store
from app.core.init_db import SessionLocal
from app.models.user import User
from app.models.item import Item
from app.schemas.item import ItemCreate
from app.schemas.lost_report import LostReportCreate
from app.schemas.found_report import FoundReportCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
#lost report endpoints
@router.post("/createLostReport/")
def create_lost_report(report = LostReportCreate, db=Depends(get_db)):
    return report_store.create_lost_report(db, report.user_id, report.item_id, report.name, 
                                       report.description, report.longitude, report.latitude, 
                                       report.radius, report.bounty)

@router.put("/editLostReport/{report_id}")
def edit_lost_report(report_id: int, report: LostReportCreate, db=Depends(get_db)):
    return report_store.edit_lost_report(db, report_id, report.name, report.description, 
                                     report.longitude, report.latitude, report.radius, 
                                     report.bounty)

@router.delete("/deleteLostReport/{report_id}")
def delete_lost_report(report_id: int, db=Depends(get_db)):
    return report_store.delete_lost_report(db, report_id)

@router.get("/getLostReportByUser/{user_id}")
def get_lost_report_by_user(user_id: int, db=Depends(get_db)):
    return report_store.get_lost_reports_by_user(db, user_id)


#found report endpoints
@router.post("/createFoundReport/")
def create_found_report(report = FoundReportCreate, db=Depends(get_db)):
    return report_store.create_found_report(db, report.founder_id, report.item_id, report.name, 
                                       report.description, report.longitude, report.latitude, 
                                       report.radius, report.request_bounty)

@router.put("/editFoundRepor/{report_id}")
def edit_found_report(report_id: int, report: FoundReportCreate, db=Depends(get_db)):
    return report_store.edit_found_report(db, report_id, report.name, report.description, 
                                     report.longitude, report.latitude, report.radius, 
                                     report.request_bounty)

@router.delete("/deleteFoundReport/{report_id}")
def delete_found_report(report_id: int, db=Depends(get_db)):
    return report_store.delete_found_report(db, report_id)

@router.get("/getFoundReportByUser/{user_id}")
def get_found_report_by_user(user_id: int, db=Depends(get_db)):
    return report_store.get_found_reports_by_user(db, user_id)

