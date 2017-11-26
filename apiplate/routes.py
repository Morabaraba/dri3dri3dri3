from flask import render_template, send_from_directory

from .core import app, task_app

from .tasks import add

@app.route('/static/<path:path>') # for testing only use nginx to serve `/static`
def send_static(path):
    return send_from_directory('static', path)


@app.route('/index.html') # @app.route('/') # TODO seems to break connexion swagger ui route. 
def index_view():
    return render_template('index.html', state={})
    
@app.route('/task/add') 
def task_add_view():
    if task_app:
        r = add.delay(1,1)
    else:
        r = add(1,1)
    return str(r)
    
    