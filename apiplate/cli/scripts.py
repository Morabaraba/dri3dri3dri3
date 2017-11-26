import click

from ..core import app
from .run import run_os

SHELL_RM_PYCHACHE = '''find . -name '__pycache__' -exec rm -rf {} \;'''
'''remove all `__pycache__` directories on a *nix machine using `find` and `rm`.

https://stackoverflow.com/a/28365204/4434121 thanks buddy, wanted to comment but I don't have the cred. I just used rm in my find.
'''

@app.cli.command()
def rm_pycache():
    run_os(SHELL_RM_PYCHACHE)