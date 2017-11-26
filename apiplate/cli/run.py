'''Simple `run` function to execute java and other shell applications.

Copied from https://github.com/miracle2k/python-closure/blob/master/closure/__init__.py with modifications
https://github.com/Morabaraba/python-closure/commit/714352d6ea746efceda2697b11012955b5500b0a
'''
import os
import sys
import subprocess
from pkg_resources import resource_filename


def get_jar_filename():
    """Return the full path to the Closure Compiler Java archive."""
    return resource_filename(__name__, "closure.jar")


def run_java(*args):
    cmd_args = ["java", "-jar", get_jar_filename()] + list(args)
    return subprocess.call(cmd_args)

def run_shell(*args):
    cmd_args = list(args)
    return subprocess.call(cmd_args)

def run_os(args):
    return os.system(args)
    
def main():
    exit_code = run_shell(*sys.argv[1:])
    sys.exit(exit_code)
