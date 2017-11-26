try:
    from closure import run as closure_run
except ImportError:
    # raise ImportError('Could not import closure. No javascript cli commands')
    closure_run = None
    
from pathlib import Path

def check_closure(print_error=True):
    if not closure_run:
        if print_error:
            print('Could not find closure. `pip install closure` to use command.')
        return False
    return True
    
def find_js_files(indir):
	rootdir = Path(indir)
	# Return a list of regular files only, not directories
	return [f.relative_to(indir).as_posix() for f in rootdir.glob('**/*.js') if f.is_file()]

def closure_minify_js_app():
    if not check_closure():
        return False
    out_js_file='static/app/app.min.js'
    js_args= [
        '--js=static/app/js/app/**.js',
        '--js_output_file=%s' % (out_js_file),
    ]
    closure_run(*js_args)
    return True

def closure_minify_js_lib():
    if not check_closure():
        return False
    out_js_file='static/app/lib.min.js'
    js_lib_dir = 'static/app/js/lib'
    js_arg_templ =  '--js=%s'
    js_args = [
        '--js=static/app/js/lib/firebugx.js',
        '--js=static/app/js/lib/jquery-1.11.2.min.js',
        '--js=static/app/js/lib/jquery-ui-1.11.3.min.js',
        '--js=static/app/js/lib/jquery.event.drag-2.3.0.js',
        '--js=static/app/js/lib/slickgrid/slick.core.js',
        '--js=static/app/js/lib/slickgrid/plugins/slick.autotooltips.js',
        '--js=static/app/js/lib/slickgrid/plugins/slick.cellrangedecorator.js',
        '--js=static/app/js/lib/slickgrid/plugins/slick.cellrangeselector.js',
#       '--js=static/app/js/lib/slickgrid/plugins/slick.cellexternalcopymanager.js'
#       '--js=static/app/js/lib/slickgrid/plugins/slick.cellselectionmodel.js',
        '--js=static/app/js/lib/slickgrid/slick.editors.js',
        '--js=static/app/js/lib/slickgrid/slick.formatters.js',
        '--js=static/app/js/lib/slickgrid/slick.grid.js',
        '--js=static/app/js/lib/slickgrid/slick.dataview.js',
        '--js=static/app/js/lib/onmount.v1.3.0.js',
        '--js=static/app/js/lib/lodash.v3.10.1.custom.min.js',
        '--js=static/app/js/lib/backbone-v1.3.3.min.js',
        '--js=static/app/js/lib/goldenlayout-v1.5.9.min.js'
        ] # hard code specific deps to the top
        
    for js_file in find_js_files(js_lib_dir):
        js_arg = js_arg_templ % (js_lib_dir + '/' + js_file)
        if js_arg not in js_args:
            js_args.append(js_arg)
    js_args = js_args + [
        '--js_output_file=%s' % (out_js_file),
    ]
    closure_run(*js_args)
    return True
