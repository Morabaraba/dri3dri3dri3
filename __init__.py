# https://github.com/zalando/connexion#running-it
import connexion

def main():
    app = connexion.App(__name__, specification_dir='apispec/')
    app.add_api('halfabeast.yaml')
    app.run(port=8080)


if __name__ == '__main__':
    main()