import os
from flask import Flask, request
from flask.helpers import make_response
from flask_restful import reqparse, Api
from jwt import algorithms
import orjson as json
import mongoengine 
from dotenv import load_dotenv
import models
import jwt
from Errors import *

load_dotenv('./.env')

app = Flask(__name__)
api = Api(app)
parser = reqparse.RequestParser()
DB = None
JWT_ALGORITHM = "HS256"

# CONNECT TO MONGODB DATABASE
mongoengine.connect(host=os.environ["DB_URI"])

@app.errorhandler(404)
def page_not_found(error):
    res = make_response()
    res.status_code = 404
    return res

@app.route('/signup',methods=["POST"])
def signup():
    res = make_response()
   
    try:
        req_data = request.json
        
        # ADD THE USER TO THE DATABASE
        UID = str(models.Account(**req_data).save().id)

        # GENERATE ACCESS_TOKEN
        accessToken = jwt.encode(
        {
            "uid" : UID
        },
        key=os.environ["JWT_SECRET"],
        algorithm=JWT_ALGORITHM
        )

        res.content_type = "application/json"

        # RESPONSE DATA
        res.data = json.dumps({
            "success": True,
            "accessToken" : accessToken
        })

    except Exception as e:
        res.status_code = 500
        res.status = str(e)
    return res


@app.route('/signin',methods=["POST"])
def signin():
    res = make_response()
    res.content_type = "application/json"
    try:
        req_data = request.json

        # app.logger.info(req_data)
        
        queryData = models.Account.objects(username=req_data["username"], password=req_data["password"])
        
        if not queryData: raise UserNotFound()

        # GET THE USER ID
        UID = str(queryData[0].id)

        # GENERATE ACCESS_TOKEN
        accessToken = jwt.encode(
        {
            "uid" : UID
        },
        key=os.environ["JWT_SECRET"],
        algorithm=JWT_ALGORITHM
        )
        
        res.content_type = "application/json"

        # RESPONSE DATA
        res.data = json.dumps({
            "success": True,
            "accessToken" : accessToken
        })
    except UserNotFound:
        res.status_code = 404
        res.status = "User Not Found"
    except Exception as e:
        res.status_code = 500
        
    return res


if __name__== '__main__':
    app.run(debug=True)