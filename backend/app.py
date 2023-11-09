from flask import Flask, jsonify,request,sessions
from elasticsearch import Elasticsearch
from flask_cors import CORS
from routes.leaveTypes import leavetypes_bp
from routes.leaveRequest import leaverequest_bp
from routes.auth import auth_bp
from routes.users import users_bp
from flask_session import Session


es = Elasticsearch(["http://localhost:9200"])

app = Flask(__name__)
CORS(app)  

app.config['SECRET_KEY'] = 'secret_key' 
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_USE_SIGNER'] = True


Session(app)



app.register_blueprint(leavetypes_bp, url_prefix='/leavetype')

app.register_blueprint(leaverequest_bp,url_prefix='/leaverequest')

app.register_blueprint(auth_bp,url_prefix='/')

app.register_blueprint(users_bp,url_prefix='/users')
    

if __name__ == '__main__':
    app.run()
