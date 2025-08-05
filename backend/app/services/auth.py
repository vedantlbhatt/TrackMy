import os
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    if expires_delta:
        expire = datetime.now(datetime.timezone.utc)() + expires_delta
    else:
        expire = datetime.now(datetime.timezone.utc)() + timedelta(minutes=15)

        expire_timestamp = expire.timestamp()
        payload = data.copy()
        payload.update({"exp": expire_timestamp})

        jwt.encode(payload, SECRET_KEY, algorithm = ALGORITHM)