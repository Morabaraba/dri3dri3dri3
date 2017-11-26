## apiplate python package

### Directory layout

Below is a outdated and modified tree print with comments.

This will give you a idea of the project layout.

```sh
tree apiplate/
apiplate
├── README.md # this file
├── __init__.py # loads `.config`, `.core` and enabled modules as needed
├── api
│   └── __init__.py # example swagger api end points
├── apispec
│   └── halfabeast.yaml # openapi specification using swagger v2 yaml format
├── cli # click flask cli commands you can run from the terminal
│   ├── __init__.py # just import `.web`, `.scripts`
│   ├── run.py # run stuff on the os like java cli commands
│   ├── scripts.py # cli commands we want to wrap like `rm_pycache`
│   └── web.py # minify js css
├── config.py -> config.py.example # we symlink `config.py` so we can checkin .example but not config.py
├── config.py.example # for production(yolo) `cp config.py.example config.py` instead of symlinking it as seen above.
├── core.py # setup our flask app or connexion api if needed by the config
├── data # the redit project data hanging around... ***kriek kriek***
│   ├── README.md
│   ├── rows.csv
│   └── wxib-fsgn.json
├── js
│   └── __init__.py # little helper functions to minify js code
├── model
│   ├── __init__.py # experiment to clone sqla models using a func
│   └── copy_object.py # example found on sqla forum
├── options.py # where we define our `RunAs` enum
├── orm_in_detail.sqlite # example database created with `python apiplate/model/__init__.py`
├── routes.py # flask routes
├── static # static content like html and js, css, etc...
│   └── app
│       ├── app.min.js # we minify our app
│       ├── css
│       │   ├── custom.css
│       │   └── images
│       │       └── arrow_right_spearmint.png
│       ├── index.html # debug version
│       ├── index.min.html# use min libs
│       ├── js
│       │   ├── app # this gets minified to app.min.js
│       │   │   ├── goldenlayout.js
│       │   │   └── main.js
│       │   └── lib # this gets minified to lib.min.js
│       │       ├── backbone-v1.3.3.min.js
│       │       ├── firebugx.js
│       │       ├── goldenlayout-v1.5.9-mod.js
│       │       ├── jquery-1.11.2.min.js
│       │       ├── jquery-ui-1.11.3.min.js
│       │       ├── jquery.event.drag-2.3.0.js
│       │       ├── lodash.v3.10.1.custom.min.js
│       │       └── onmount.v1.3.0.js
│       └── lib.min.js # 600KB+- :'(
├── tasks.py # celery @shared_tasks
└── templates # jinja2 templates
    ├── _base.html
    ├── _index.html
    └── _macros.html

15 directories, 44 files
```

I did not add projects like recline and swagger-ui I stash in `apiplate/static/*`.

So you might find old stuff or projects linger around.