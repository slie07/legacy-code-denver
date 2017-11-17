import requests
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    response =  requests.get('http://192.168.0.14:8100')
    return response.text


app.run(host='localhost', port=8000, debug=True)
