from flask import request, jsonify, Blueprint, session,Flask
from elasticsearch import Elasticsearch
from bcrypt import hashpw, checkpw, gensalt
from flask_session import Session


users_bp = Blueprint('users', __name__)

es = Elasticsearch(["http://localhost:9200"])


@users_bp.route('', methods=['GET'])
def get_leave_types():
    result = es.search(index='users', body={"size": 1000})  
    hits=result['hits']['hits']
    users=[]
    for hit in hits:
            source = hit['_source']
            user = {
                "name":source["name"],
                "secondName":source["secondName"],
                "role":source["role"],
                "email":source["email"],
                'id':hit['_id'],
            }
            users.append(user)
    return jsonify(users)



@users_bp.route('/delete/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
       
        user_result = es.delete(index='users', id=user_id)

        if user_result['result'] == 'deleted':
           
            leave_query = {
                "query": {
                    "term": {
                        "sub_id.keyword": user_id
                    }
                }
            }
            leave_result = es.delete_by_query(index='leaverequests', body=leave_query)

            if leave_result['deleted'] > 0:
                return jsonify({'message': 'User and associated leave requests deleted successfully'})
            else:
                return jsonify({'message': 'User deleted, but no associated leave requests found'}), 404
        else:
            return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Error deleting user', 'error': str(e)}), 500




@users_bp.route('/update/<user_id>', methods=['PUT'])
def user_update(user_id):
    try:
        user_object = es.get(index='users', id=user_id)['_source']
        name = request.json.get('name', user_object['name'])
        second_name = request.json.get('secondName', user_object['secondName'])
        role = request.json.get('role', user_object['role'])  

       
        user_object['name'] = name
        user_object['secondName'] = second_name
        user_object['role'] = role  

        result = es.index(index='users', id=user_id, body=user_object)  
        if result['result'] == 'updated':
            return jsonify({'message': 'User updated successfully'})
        else:
            return jsonify({'message': 'Error updating user'}), 500

    except Exception as e:
        return jsonify({'message': 'User not found or Error updating user', 'error': str(e)}), 404

