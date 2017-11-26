from .core import task_app

@task_app.task
def add(x, y):
    return x + y