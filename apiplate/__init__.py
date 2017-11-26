from flask import render_template

from .options import RunAs
from .config import run_as
from .core import api, app


if RunAs.ROUTES in run_as:
    from .routes import *


if RunAs.CLI in run_as:
    from .cli import *


if api:
    api.add_api('halfabeast.yaml') # TODO loop over `apispec/*.yaml` and add all files