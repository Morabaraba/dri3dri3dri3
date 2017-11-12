# https://github.com/zalando/connexion#running-it


from .core import api, app
from .cli import *


def main():
    api.add_api('halfabeast.yaml')
    @app.route('/static/<path:path>') # for testing only use nginx to serve `/static`
    def send_static(path):
        return send_from_directory('static', path)
    app.run(host='0.0.0.0', port=8081)    


if __name__ == '__main__':
    main()