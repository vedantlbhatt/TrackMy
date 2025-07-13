from app.models.user import User

def create_user(db, email, user_name, payment_source):
    user = User(email=email, user_name=user_name, payment_source=payment_source)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user