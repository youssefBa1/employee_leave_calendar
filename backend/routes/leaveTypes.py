from flask import Blueprint, request, jsonify
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConflictError

leavetypes_bp = Blueprint('leavetypes', __name__)

es = Elasticsearch(["http://localhost:9200"])


@leavetypes_bp.route('', methods=['GET'])
def get_leave_types():
    result = es.search(index='leavetypes', body={"size": 1000})  
    hits=result['hits']['hits']
    options=[]
    for hit in hits:
            source = hit['_source']
            option = {
                "value":source["value"],
                'id':hit['_id'],
            }
            options.append(option)
    return jsonify(options)



@leavetypes_bp.route('/add', methods=['POST'])
def add_leave_type():
    value = request.json.get('value')
    color = "undefined"

    # Check if the value already exists in the index
    query = {
        "query": {
            "term": {
                "value.keyword": value
            }
        }
    }
    existing_leave_types = es.search(index='leavetypes', body=query)
    if existing_leave_types['hits']['total']['value'] > 0:
        return jsonify({'message': 'Leave type with this value already exists.'}), 409

    leave_type_object = {
        'value': value,
        'color': color
    }
    try:
        result = es.index(index='leavetypes', body=leave_type_object)
        if result['result'] == 'created':
            return jsonify({'message': 'Leave type submitted successfully'})
        else:
            return jsonify({'message': 'Error submitting leave type'}), 500
    except ConflictError:
        return jsonify({'message': 'Leave type with this value already exists.'}), 409


@leavetypes_bp.route('/delete/<leave_id>', methods=['DELETE'])
def delete_leave_type(leave_id):
    try:
        result = es.delete(index='leavetypes', id=leave_id)
        if result['result'] == 'deleted':
            return jsonify({'message': 'Leave type deleted successfully'})
        else:
            return jsonify({'message': 'Leave type not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Error deleting leave type', 'error': str(e)}), 500


@leavetypes_bp.route('/update/<leave_id>', methods=['PUT'])
def update_leave_type(leave_id):
    try:
        leave_type_object = es.get(index='leavetypes', id=leave_id)['_source']
        value = request.json.get('value', leave_type_object['value'])
        color = request.json.get('color', leave_type_object['color'])

        # Check if the value already exists in the index (excluding the current leave type)
        query = {
            "query": {
                "bool": {
                    "must_not": {
                        "term": {
                            "value.keyword": leave_type_object['value']
                        }
                    },
                    "filter": {
                        "term": {
                            "value.keyword": value
                        }
                    }
                }
            }
        }
        existing_leave_types = es.search(index='leavetypes', body=query)
        if existing_leave_types['hits']['total']['value'] > 0:
            return jsonify({'message': 'Leave type with this value already exists.'}), 409

        leave_type_object['value'] = value
        leave_type_object['color'] = color

        result = es.index(index='leavetypes', id=leave_id, body=leave_type_object)
        if result['result'] == 'updated':
            return jsonify({'message': 'Leave type updated successfully'})
        else:
            return jsonify({'message': 'Error updating leave type'}), 500

    except e:
        return jsonify({'message': 'Leave type not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Error updating leave type', 'error': str(e)}), 500
