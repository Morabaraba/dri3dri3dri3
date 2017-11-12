import connexion
from flask import Flask

def setup_api(apispec_dir='apispec/'):
    api = connexion.App(__name__, specification_dir=apispec_dir)
    app = api.app
    return (api, app)
    
def setup_app():
    api = None
    app = Flask(__name__)
    return (api, app)

if True:
    (api, app) = setup_api()
else:
    (api, app) = setup_app()