# https://github.com/zalando/connexion#running-it
import connexion

def main():
    app = connexion.App(__name__, specification_dir='apispec/')
    app.add_api('halfabeast.yaml')
    
    @app.app.route('/static/<path:path>')
    def send_js(path):
        return send_from_directory('static', path)
    
    app.run(port=8080)    


if __name__ == '__main__':
    main()