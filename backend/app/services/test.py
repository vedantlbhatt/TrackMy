from app.core.init_db import SessionLocal
from app.models.user import User

db = SessionLocal()
new_user = User(email="test@example.com", user_name="Test", payment_source="src_123")
db.add(new_user)
db.commit()
db.refresh(new_user)
db.close()


# Need to delete later, but we can play around it