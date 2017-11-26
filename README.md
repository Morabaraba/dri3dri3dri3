
        .___     ________ .__    .___     ________ .__    .___     ________ .__ 
      __| _/_____\_____  \|__| __| _/_____\_____  \|__| __| _/_____\_____  \|__|
     / __ |\_  __ \_(__  <|  |/ __ |\_  __ \_(__  <|  |/ __ |\_  __ \_(__  <|  |
    / /_/ | |  | \/       \  / /_/ | |  | \/       \  / /_/ | |  | \/       \  |
    \____ | |__| /______  /__\____ | |__| /______  /__\____ | |__| /______  /__|
         \/             \/        \/             \/        \/             \/    
    ----------------------------------------------------------------------------
    apiplate a py connexion openapi boilerplate 


## Introduction

I want to use `apiplate` as a testbed for learning python development and
asking the community questions with solid examples.

This was a attempt to do [[2017-09-29] Challenge #333 [Hard] Build a Web API-driven Data Site][#333]. 
Using python with the api powered by [connexion], [swagger-ui] (backbonejs) and 
[reclinejs] for building data applications(backbonejs).

I got bored and started to play around with `pip` packages and different ideas
I have for web boilerplate. 

This is a wip and pet project; and I am aware I need to look into Flask Blueprints!

### Install and Run


```sh
virtualenv -p python3 venv # might need to install it with `pip install virtualenv` first.
source venv/bin/activate
pip install -r requirements.txt # does a -e . and we did not pin any version in a attempt to use latest and greatest so code might break.
ln -s apiplate/config.py.example apiplate/config.py
export FLASK_APP=apiplate
flask
```

## Tech

This is a wip and pet project, exploring the following tech:

#### Python:

- OpenAPI/Swagger
- Flask/Connexion
- Celery

#### Javascript:

- Google Closure Compiler
- Swagger UI v2
- Reclinejs
- Slickgrid
- Backbone

#### Backend:

- RabbitMQ
- SQLLite3


#### Notes

Our python virtualenv site-packages weigh in at 42 MB.

### FAQ

**Q:** It is *2017* Why backbone, $, _, and friends? 
And not react/redux, angular2, 
vue.js, mithril, closure library, ember, or `<your fav js lib here>`?

**A:** Because I like and want to use [slickgrid] and it depends on $.
Swagger-UI v2 and Recline uses backbonejs. So just adding another
library to manage js does not seem optimal. And a goal is to use
google closure compiler to get the js to an acceptable minified size(atm 250kb for demo app with libs).

[slickgrid]: https://github.com/6pac/SlickGrid

## Initial Setup

While this steps is not needed anymore if you followed `Install and run` above
but I'm leaving here as a demo how this boilerplate got setup initially.

### Setup Env

```sh
PRJ_DIR=dreidreidrei
mkdir $PRJ_DIR
cd $PRJ_DIR
virtualenv -p python3 venv # might need to install it with `pip install virtualenv` first.
source venv/bin/activate
pip install connexion
pip freeze > requirements.txt
wget https://github.com/mattfullerton/recline-view-multiview-demo/archive/gh-pages.zip
unzip gh-pages.zip
mv recline-view-multiview-demo-gh-pages static
cd static
python -m http.server 8081
```


### Create a swagger spec

```
PRJ_DIR=dreidreidrei
cd $PRJ_DIR
mkdir apispec
vim apispec/halfabeast.yaml # https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v2.0/yaml/petstore.yaml
vim __init__.py # https://github.com/zalando/connexion#running-it
python __init__.py
```

Now a restful swagger api web app is running at:

- http://localhost:8080/v1/ui/#!/data/api_getData

and reclinejs data explorer web app running at:

- http://localhost:8081/

Next step will be to change the multiview explorer example code to use our swagger-api.

### License 

mit

[reclinejs]: https://reclinejs.com
[Connexion]: https://github.com/zalando/connexion
[#333]: https://www.reddit.com/r/dailyprogrammer/comments/739j8c/20170929_challenge_333_hard_build_a_web_apidriven/
[swagger-ui]: https://github.com/swagger-api/swagger-ui/tree/v2.2.10