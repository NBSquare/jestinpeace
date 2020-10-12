from flask import Flask, request
from requests.auth import HTTPBasicAuth

import json
import os
import requests

app = Flask(__name__)
client_id = os.environ.get('CLIENT_ID')
client_secret = os.environ.get('CLIENT_SECRET')

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
