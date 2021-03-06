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
    out_js_file='apiplate/static/app/app.min.js'
    js_arg_templ =  '--js=apiplate/%s'
    js_args= [
        js_arg_templ % 'static/app/js/app/**.js',
        '--js_output_file=%s' % (out_js_file),
    ]
    closure_run(*js_args)
    return True

def closure_minify_js_lib():
    if not check_closure():
        return False
    out_js_file='apiplate/static/app/lib.min.js'
    js_lib_dir = 'static/app/js/lib'
    js_arg_templ =  '--js=apiplate/%s'
    js_args = [
        js_arg_templ % 'static/app/js/lib/firebugx.js',
        js_arg_templ % 'static/app/js/lib/jquery-1.11.2.min.js',
        js_arg_templ % 'static/app/js/lib/jquery-ui-1.11.3.min.js',
        js_arg_templ % 'static/app/js/lib/jquery.event.drag-2.3.0.js',
        js_arg_templ % 'static/app/js/lib/slickgrid/slick.core.js',
        js_arg_templ % 'static/app/js/lib/slickgrid/plugins/slick.autotooltips.js',
        js_arg_templ % 'static/app/js/lib/slickgrid/plugins/slick.cellrangedecorator.js',
        js_arg_templ % 'static/app/js/lib/slickgrid/plugins/slick.cellrangeselector.js',
        js_arg_templ % 'static/app/js/lib/slickgrid/plugins/slick.cellselectionmodel.js', # TODO app.min.js:7 Uncaught TypeError: Slick.CellSelectionModel is not a constructor
        js_arg_templ % 'static/app/js/lib/slickgrid/plugins/slick.cellexternalcopymanager.js',
        js_arg_templ % 'static/app/js/lib/slickgrid/slick.editors.js',
        js_arg_templ % 'static/app/js/lib/slickgrid/slick.formatters.js',
        js_arg_templ % 'static/app/js/lib/slickgrid/slick.grid.js',
        js_arg_templ % 'static/app/js/lib/slickgrid/slick.dataview.js',
        js_arg_templ % 'static/app/js/lib/onmount.v1.3.0.js',
        js_arg_templ % 'static/app/js/lib/lodash.v3.10.1.custom.min.js',
        js_arg_templ % 'static/app/js/lib/backbone-v1.3.3.min.js',
        js_arg_templ % 'static/app/js/lib/goldenlayout-v1.5.9-mod.js',
        js_arg_templ % 'static/app/js/lib/jsoneditor.v0.7.28.js',
        # js_arg_templ % 'static/app/js/lib/mqttws31.js',
        # js_arg_templ % 'static/app/js/lib/autobahn.17.5.2.js',
        js_arg_templ % 'static/app/js/lib/backbone.wamp.2.0.0.js',
        js_arg_templ % 'static/app/js/lib/hashids-1.1.1.js',
        js_arg_templ % 'static/app/js/lib/bootstrap-v2.3.2.min.js',
        
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
