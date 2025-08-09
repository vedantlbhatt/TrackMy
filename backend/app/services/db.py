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
            print(password)
            return None
        else:
            print("all good!")
            return user
        

    def create_user(db, email, user_name, password):
        existing_user = db.query(User).filter(User.email == email).first() #checks if existing user with same email exists
        if existing_user is None: # if above query returns None, no existing user exists with that email
            random_salt = bcrypt.gensalt() # generates random salt
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8') #hashes password into hashed_password (one-way)
            user = User(email=email, user_name=user_name, hashed_password=hashed_password)
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        return None
    
     #*def signup(db, email, user_name, hashed_password): #functionally identical to create_user -> temporary
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user is None:
            random_salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(hashed_password.encode('utf-8'), random_salt).decode('utf-8')
            user = User(email=email, user_name=user_name, hashed_password=hashed_password)
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        return None
    #

    def get_user_by_id(db, user_id):
        return db.query(User).filter(User.user_id == user_id).first()
    
    def delete_user(db, user_id):
        return None # Temporary
    
class item_store:
    '''
    This may need a system where when an item is created, image and embedding as result is required. 
    From there embedding model needs to run automatically and process image. 
    (For devs, may also need a system to update embeds independently)
    This will most likely be handled in utils.
    '''
    def create_item(db, user_id, name): 
        item = Item(name=name, user_id=user_id) 
        db.add(item)
        db.commit()
        db.refresh(item)
        # use embed method in vision here
        return item

    def get_item_by_user(db, user_id, item_id):
        return db.query(Item).filter(Item.item_id == item_id, Item.user_id == user_id)
        #structure of query
    
    def get_items_by_user(db, user_id):
        return db.query(Item).filter(Item.user_id == user_id).all()
    
    def delete_item(db, item_id):
        return None # Temporary
