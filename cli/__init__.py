import datetime

import click

from ..core import app
from ..js import closure_minify_js_app, closure_minify_js_lib


@app.cli.command()
def minify_js_lib():
    start_time = datetime.datetime.now()
    click.echo('Minifying js lib...')
    closure_minify_js_lib()
    
    end_time = datetime.datetime.now()
    total_time = end_time - start_time
    click.echo('Done minifying js, took %s' % (total_time))


@app.cli.command()
def minify_js_app():
    start_time = datetime.datetime.now()
    click.echo('Minifying js app...')
    closure_minify_js_app()
    
    end_time = datetime.datetime.now()
    total_time = end_time - start_time
    click.echo('Done minifying js, took %s' % (total_time))
    
    
@app.cli.command()
def minify_js():
    '''Minify all `static/app/js/` to `static/app/app.min.js` and `static/app/lib.min.js`'''
    start_time = datetime.datetime.now()
    closure_minify_js_lib()
    closure_minify_js_app()
    
    end_time = datetime.datetime.now()
    total_time = end_time - start_time
    click.echo('Done minifying js, took %s' % (total_time))
    

@app.cli.command()
def minify_css(js_dir='static/app/js', out_js_file='static/app/app.min.js'):
    '''Minify all `static/app/js` into `static/app/app.min.js`'''
    start_time = datetime.datetime.now()
    click.echo('Minifying js "%s" into "%s"...' % (js_dir, out_js_file))
    # todo work here
    end_time = datetime.datetime.now()
    total_time = end_time - start_time
    click.echo('Done minifying js, took %s' % (total_time))