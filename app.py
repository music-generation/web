from flask import Flask
from flask import render_template, send_from_directory, request

from flask_scss import Scss

import midi_helper
import json
from time import sleep

app = Flask(__name__)
Scss(app, static_dir = 'static', asset_dir = 'assets')

@app.route('/')
def index():
  return render_template('index.html') 

@app.route('/midis/<path:path>')
def serve_sample_midi(path):
  return send_from_directory('midis', path)
  
@app.route('/generate', methods=['POST'])
def save_user_generated_midi():
  json = request.get_json(force=True)
  file_name = json['name']
  encoded_midi = json['uri']
  midi_helper.decode_midi(encoded_midi, file_name)
  return render_template('index.html')
