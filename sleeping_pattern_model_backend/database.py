from pymongo import MongoClient
from bson import ObjectId
import bcrypt
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['sleep_tracker']

# Collections
users = db['users']
sleep_records = db['sleep_records']

def create_user(username, email, password):
    """Create a new user with hashed password"""
    # Check if username or email already exists
    if users.find_one({'username': username}):
        return None, "Username already taken"
    if users.find_one({'email': email}):
        return None, "Email already registered"
    
    # Hash password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    # Create user document
    user = {
        'username': username,
        'email': email,
        'password': hashed,
        'created_at': datetime.utcnow()
    }
    
    # Insert user
    result = users.insert_one(user)
    return str(result.inserted_id), None

def verify_user(identifier, password):
    """Verify user credentials using either username or email"""
    # Try to find user by username or email
    user = users.find_one({
        '$or': [
            {'username': identifier},
            {'email': identifier}
        ]
    })
    
    if not user:
        return None, "User not found"
    
    if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return None, "Invalid password"
    
    return str(user['_id']), None

def save_sleep_record(user_id, record_data):
    """Save a sleep record for a user"""
    record = {
        'user_id': ObjectId(user_id),
        **record_data,
        'created_at': datetime.utcnow()
    }
    result = sleep_records.insert_one(record)
    return str(result.inserted_id)

def get_user_sleep_records(user_id):
    """Get all sleep records for a user"""
    records = list(sleep_records.find(
        {'user_id': ObjectId(user_id)},
        {'_id': 0}  # Exclude MongoDB _id
    ).sort('created_at', -1))
    return records 