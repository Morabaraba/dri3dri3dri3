from flask import render_template, send_from_directory

from .core import app

@app.route('/static/<path:path>') # for testing only use nginx to serve `/static`
def send_static(path):
    return send_from_directory('static', path)

@app.route('/')
def index_view():
    return render_template('index.html', state={})