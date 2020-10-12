from flask import Flask, request
from requests.auth import HTTPBasicAuth

import json
import os
import requests

app = Flask(__name__, static_folder='./web/build', static_url_path='/')
client_id = os.environ.get('CLIENT_ID')
client_secret = os.environ.get('CLIENT_SECRET')

@app.route('/')
@app.route('/counter')
def index():
  return app.send_static_file('index.html')

@app.route('/api/exchange', methods=['POST'])
def exchange():
  r = requests.post(
    'https://api.restream.io/oauth/token',
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth=HTTPBasicAuth(client_id, client_secret),
    data=json.loads(request.data))
  return r.text

if __name__ == "__main__":
  app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
