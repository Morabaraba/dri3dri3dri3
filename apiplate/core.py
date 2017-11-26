from .options import RunAs
from .config import run_as


def setup_api(apispec_dir='apispec/'):
    '''Setup a connexion app with a default specification_dir of 'apispec/' and return a (api, app) tuple'''
    #https://github.com/zalando/connexion#running-it
    import connexion
    api = connexion.App(__name__, specification_dir=apispec_dir)
    app = api.app
    return (api, app)
    
    
def setup_app():
    '''Setup only a Flask app and return a (None, app) tuple'''
    from flask import Flask
    api = None
    app = Flask(__name__)
    return (api, app)


if RunAs.API in run_as: # if we run as API we create `api` and `app` object
    (api, app) = setup_api()    
elif RunAs.CLI in run_as: # if we run as CLI we only create `app` and set `api = None`
    (api, app) = setup_app()


if RunAs.TASKS in run_as: #
    from celery import Celery
    task_app = Celery('tasks', broker='pyamqp://guest@localhost//') # TODO get config from .config
else:
    task_app = None