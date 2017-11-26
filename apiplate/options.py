from enum import Enum

class RunAs(Enum):
    CLI = 'cli' # Start flask CLI
    ROUTES = 'routes' # Import flask routes
    API = 'api' # Start connexion API and app