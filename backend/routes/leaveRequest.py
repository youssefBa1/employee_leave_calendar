from flask import Blueprint, request, jsonify,session
from elasticsearch import Elasticsearch
from datetime import datetime



leaverequest_bp = Blueprint('leaverequest', __name__)

es = Elasticsearch(["http://localhost:9200"])

def get_days_between(start_date, end_date):
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')
    days_between = (end - start).days +1

    return days_between


@leaverequest_bp.route('/myleaverequest', methods=['GET'])
def get_leave_requests():
    try:
        if 'email' not in session:
            return jsonify({'error': 'User not logged in'}), 401

        user_email = session['email']
        user_name = session.get('name')
        user_second_name = session.get('secondName')

       
        query = {
            "query": {
                "match": {
                    "subId": user_email
                }
            }
        }

        result = es.search(index='leaverequests', body=query)
        hits = result['hits']['hits']
        leave_requests = []

        for hit in hits:
            source = hit['_source']
            leave_request = {
                'startDate': source['startDate'],
                'leaveDuration':source['leaveDuration'],
                'endTime':source['endTime'],
                'startTime':source['startTime'],
                'endDate': source['endDate'],
                'leaveType': source['leaveType'],
                'status': source['status'],
                'numberDays': source['numberDays'],
                'id':hit['_id'],
                'subName': source['subId'],
                'name': user_name,
                'secondName': user_second_name,
            }
            leave_requests.append(leave_request)

        return jsonify(leave_requests)
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@leaverequest_bp.route('/all',methods=['GET'])
def get_all_leaverequest():
    result=es.search(index='leaverequests')
    hits=result['hits']['hits']
    leave_requests=[]
    for hit in hits:
            source = hit['_source']
            leave_request = {
                'startDate': source['startDate'],
                'endDate': source['endDate'],
                'leaveDuration':source['leaveDuration'],
                'endTime':source['endTime'],
                'startTime':source['startTime'],
                'leaveType': source['leaveType'],
                'status': source['status'],
                'numberDays': source['numberDays'],
                'name': source["subName"],
                'secondName': source["subSecondName"],
                'id':hit['_id'],
            }
            leave_requests.append(leave_request)
    returned_Data={"role":session.get('role'),"leaverequests":leave_requests}           
    
    return jsonify(returned_Data)





@leaverequest_bp.route('/add', methods=['POST'])
def add_leave_request():
    print(request.json)
    start_date = request.json.get('startDate')
    end_date = request.json.get('endDate')
    leave_type = request.json.get('leaveType')
    status = 'pending'
    sub_name=session['name']
    sub_second_name=session['secondName']
    sub_id = session.get('email')
    leave_duration = request.json.get('leaveDuration')
    start_time = request.json.get('startTime')
    end_time = request.json.get('endTime')


    number_days = request.json.get('numberDays')
    print(number_days)

    leave_request_obj = {
        'startDate': start_date,
        'endDate': end_date,
        'leaveType': leave_type,
        'status': status,
        "approverId": "",
        "subId": sub_id,
        "numberDays": number_days,
        "subName":sub_name,
        "subSecondName":sub_second_name,
        "leaveDuration":leave_duration,
        "startTime":start_time,
        "endTime":end_time
    }
    result = es.index(index='leaverequests', body=leave_request_obj)
    if 'result' in result and result['result'] == 'created':
        return jsonify({'message': 'Leave request submitted successfully'})
    else:
        return jsonify({'message': 'Error submitting leave request'})


@leaverequest_bp.route('/delete/<string:request_id>', methods=['DELETE'])
def delete_leave_request(request_id):
    try:
        result = es.delete(index='leaverequests', id=request_id)
        if 'result' in result and result['result'] == 'deleted':
            return jsonify({'message': 'Leave request deleted successfully'})
        else:
            return jsonify({'message': 'Error deleting leave request'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@leaverequest_bp.route('/deleteall',methods=['DELETE'])
def empty_index():
    try:
        
        es.delete_by_query(index='leaverequests', body={"query": {"match_all": {}}})

        return jsonify({'message': 'All leaves deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@leaverequest_bp.route('update/<string:request_id>', methods=['PUT'])
def update_leave_request_status(request_id):
    try:
        if 'email' not in session:
            return jsonify({'error': 'User not logged in'}), 401

        user_email = session['email']
        user_role = session.get('role')

       
       
        data = request.get_json()
        new_status = data.get('status')

        if not new_status or new_status not in ['accepted', 'rejected']:
            return jsonify({'error': 'Invalid status'}), 400

       
        leave_request = es.get(index='leaverequests', id=request_id)

    
        if leave_request['_source']:
            leave_request['_source']['status'] = new_status
            es.index(index='leaverequests', id=request_id, body=leave_request['_source'])

            return jsonify({'message': 'Leave request status updated successfully'})
        else:
            return jsonify({'error': 'Leave request not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500





@leaverequest_bp.route('/handeled',methods=['DELETE'])
def empty_handled_leaves():
    try:
        
        es.delete_by_query(index='leaverequests', body={
            "query": {
                "terms": {
                    "status": ["accepted", "rejected"]
                }
            }
        })

        return jsonify({'message': 'All handled leaves deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@leaverequest_bp.route('/updateAll/<string:request_id>', methods=['PUT'])
def update_leave_request_all(request_id):
    try:
        if 'email' not in session:
            return jsonify({'error': 'User not logged in'}), 401

        user_email = session['email']
        user_role = session.get('role')

        data = request.get_json()
        new_start_date = data.get('startDate')
        new_end_date = data.get('endDate')
        new_leave_type = data.get('leaveType')

        leave_request = es.get(index='leaverequests', id=request_id)

        if leave_request['_source']:
            leave_request['_source']['startDate'] = new_start_date
            leave_request['_source']['endDate'] = new_end_date
            leave_request['_source']['leaveType'] = new_leave_type

            es.index(index='leaverequests', id=request_id, body=leave_request['_source'])

            return jsonify({'message': 'Leave request updated successfully'})
        else:
            return jsonify({'error': 'Leave request not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@leaverequest_bp.route('/search', methods=['GET'])
def search_leave_requests_by_name():
    try:
        
        name_query = request.args.get('name')

        
        search_query = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "subName": name_query 
                            }
                        }
                    ]
                }
            }
        }

        result = es.search(index='leaverequests', body=search_query)
        hits = result['hits']['hits']
        leave_requests = []

        for hit in hits:
            source = hit['_source']
            leave_request = {
                'startDate': source['startDate'],
                'leaveDuration':source['leaveDuration'],
                'endTime':source['endTime'],
                'startTime':source['startTime'],
                'endDate': source['endDate'],
                'leaveType': source['leaveType'],
                'status': source['status'],
                'numberDays': source['numberDays'],
                'id':hit['_id'],
                'subName': source['subId'],
            }
            leave_requests.append(leave_request)

        return jsonify(leave_requests)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


