import datetime

import click

from ..core import app

@app.cli.command()
def minify_js(js_dir='static/app/js', out_js_file='static/app/app.min.js'):
    '''Minify all `static/app/js` into `static/app/app.min.js`'''
    start_time = datetime.datetime.now()
    click.echo('Minifying js "%s" into "%s"...' % (js_dir, out_js_file))
    # todo work here
    end_time = datetime.datetime.now()
    total_time = end_time - start_time
    click.echo('Done minifying js, took %s' % (total_time))