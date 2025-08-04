from app.models.user import User
from app.models.item import Item
from fastapi import HTTPException, status
import bcrypt

class user_store:

    def login_user(db, email, password):
        user = db.query(User).filter(User.email == email).first()
        if (not user):
            print("not user")
            return None
        if (not (bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')) == True)):
            print("bad password")
            return None
        else:
            print("all good!")
            return user
        

    def signup(db, email, user_name, password): #functionally identical to create_user -> temporary
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user is None:
            random_salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password, random_salt)
            user = User(email=email, user_name=user_name, password=hashed_password)
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        return None

    def create_user(db, email, user_name, hashed_password):
        existing_user = db.query(User).filter(User.email == email).first() #checks if existing user with same email exists
        if existing_user is None: # if above query returns None, no existing user exists with that email
            random_salt = bcrypt.gensalt() # generates random salt
            hashed_password = bcrypt.hashpw(hashed_password.encode('utf-8'), random_salt) #hashes password into hashed_password (one-way)
            user = User(email=email, user_name=user_name, hashed_password=hashed_password)
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        return None
    


    def get_user_by_id(db, user_id):
        return db.query(User).filter(User.user_id == user_id).first()
    
    def delete_user(db, user_id):
        return None # Temporary
    
class item_store:
    def create_item(db, user_id, name):
        item = Item(name=name, user_id=user_id)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    def get_item_by_user(db, user_id, item_id):
        return db.query(Item).filter(Item.item_id == item_id, Item.user_id == user_id)
        #structure of query
    
    def get_items_by_user(db, user_id):
        return db.query(Item).filter(Item.user_id == user_id).all()
    
    def delete_item(db, item_id):
        return None # Temporary