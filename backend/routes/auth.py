from flask import request, jsonify, Blueprint, session,Flask
from elasticsearch import Elasticsearch
from bcrypt import hashpw, checkpw, gensalt
from flask_session import Session

auth_bp = Blueprint('auth', __name__)

es = Elasticsearch(["http://localhost:9200"])
app = Flask(__name__)






# Endpoint for user registration
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    password = data['password']
    name=data['name']
    second_name=data['secondName']
    user_count = es.count(index="users")["count"]

    # Set the role based on the number of existing users
    role = "approver" if user_count == 0 else "employee"  # Default role is 'employee'

    # Check if the user already exists
    search_query = {
        "query": {
            "term": {
                "email.keyword": email
            }
        }
    }
    search_result = es.search(index='users', body=search_query)
    if search_result['hits']['total']['value'] > 0:
        return jsonify({'message': 'User already exists'}), 400

    # Hash the password
    hashed_password = hashpw(password.encode('utf-8'), gensalt())
    hashed_password_str = hashed_password.decode('utf-8')  # Convert bytes to string

    # Create a new user document
    user = {
        'email': email,
        'password': hashed_password_str,
        'role': role,
        'name':name,
        'secondName':second_name
    }

    # Index the user document in Elasticsearch
    es.index(index='users', body=user)

    # Create a session for the user
    session['email'] = email
    

    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Retrieve the user document from Elasticsearch
    query = {
        "query": {
            "match": {
                "email": email
            }
        }
    }

    search_result = es.search(index='users', body=query)

    # Check if the user exists
    if search_result['hits']['total']['value'] == 0:
        return jsonify({'message': 'No user found with the provided email'}), 401

    # Retrieve the stored hashed password
    stored_password = search_result['hits']['hits'][0]['_source']['password']
    name= search_result['hits']['hits'][0]['_source']['name']
    secondName= search_result['hits']['hits'][0]['_source']['secondName']
    role=search_result['hits']['hits'][0]['_source']['role']
   
    # Verify the password
    if checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
        # Create a session for the user
        session['email'] = email
        session['name'] = name
        session['secondName']=secondName
        session['role']=role
        print(session['secondName'])
        
       
        return jsonify({'message': 'Login successful'}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401


@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Clear session data to log out the user
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/users/delete/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        result = es.delete(index='users', id=user_id)
        if 'result' in result and result['result'] == 'deleted':
            return jsonify({'message': 'User deleted successfully'})
        else:
            return jsonify({'message': 'Error deleting user'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/user', methods=['GET'])
def get_user_info():
    # Check if the user is logged in (authenticated)
    if 'email' not in session:
        return jsonify({'message': 'Not authenticated'}), 401

    # Retrieve user information from the session
    email = session['email']
    name = session['name']
    second_name = session['secondName']
    role = session['role']

    # Return user information as a JSON response
    return jsonify({'email': email, 'name': name, 'secondName': second_name, 'role': role}), 200