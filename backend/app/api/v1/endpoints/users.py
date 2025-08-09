from fastapi import APIRouter, Depends
from app.services.db import item_store
from app.services.db import user_store
from app.core.init_db import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.signup import SignupRequest
from app.schemas.login import LoginRequest
from fastapi import APIRouter, Depends
from app.services.auth import get_current_user
from app.services import auth

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup/")
def add_user(user: SignupRequest, db=Depends(get_db)):
    print("Received user:", user)
    print("googoo") # why cant i delete this
    return user_store.create_user(db, user.email, user.user_name, user.password) #should this be create user or sign up??

@router.post("/login/")
def login(request: LoginRequest, db=Depends(get_db)):
    user = user_store.login_user(db, request.email, request.password)
    if (user):
        token = auth.create_access_token(data = {"user_id": user.user_id})
        return {"access_token": token}
    print("aware that user is wrong")
    return None

@router.get("/profile/")
def read_profile(db = Depends(get_db), current_user_id = Depends(get_current_user)):
    current_user = user_store.get_user_by_id(db, current_user_id)
    return current_user

def read_profile(current_user_id: int = Depends(get_current_user)): #just figured out: current_user is the result from the Dependence on the function get_current_user
    db = Depends(get_db)
    current_user = user_store.get_user_by_id(db, current_user_id)
    return {current_user}

@router.get("/getUser/")
def get_user(user_id: int, db=Depends(get_db)):
    print(user_id)
    return user_store.get_user_by_id(db, user_id)