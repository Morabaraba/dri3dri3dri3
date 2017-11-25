import connexion
from flask import Flask

def setup_api(apispec_dir='apispec/'):
    '''Setup a connexion app with a default specification_dir of 'apispec/' and return a (api, app) tuple'''
    #https://github.com/zalando/connexion#running-it
    api = connexion.App(__name__, specification_dir=apispec_dir)
    app = api.app
    return (api, app)
    
def setup_app():
    '''Setup only a Flask app and return a (None, app) tuple'''
    api = None
    app = Flask(__name__)
    return (api, app)

from .config import only_cli

if only_cli:
    (api, app) = setup_app()
else:
    (api, app) = setup_api()