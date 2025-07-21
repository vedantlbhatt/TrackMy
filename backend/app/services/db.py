from app.models.user import User
from app.models.item import Item
class user_store:
    def create_user(db, email, user_name, payment_source):
        user = User(email=email, user_name=user_name, payment_source=payment_source)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_user_by_id(db, user_id):
        return db.query(User).filter(User.user_id == user_id).first()
    
class item_store:
    def create_item(db, name, user_id):
        item = Item(name=name, user_id=user_id)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    def get_item_by_user(db, user_id, item_id):
        return db.query(Item).filter(Item.id == item_id, Item.user_id == user_id).first()

