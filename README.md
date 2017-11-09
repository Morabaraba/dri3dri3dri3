
        .___     ________ .__    .___     ________ .__    .___     ________ .__ 
      __| _/_____\_____  \|__| __| _/_____\_____  \|__| __| _/_____\_____  \|__|
     / __ |\_  __ \_(__  <|  |/ __ |\_  __ \_(__  <|  |/ __ |\_  __ \_(__  <|  |
    / /_/ | |  | \/       \  / /_/ | |  | \/       \  / /_/ | |  | \/       \  |
    \____ | |__| /______  /__\____ | |__| /______  /__\____ | |__| /______  /__|
         \/             \/        \/             \/        \/             \/    
    ----------------------------------------------------------------------------
    py connexion openapi boilerplate 


## Introduction

A late submission to [[2017-09-29] Challenge #333 [Hard] Build a Web API-driven Data Site][#333]. Using python with the api powered by [connexion], [swagger-ui] (backbonejs) and [reclinejs] for building data applications(backbonejs).

## Rules

Your solution must implement the following API behaviors:

- A "get_voters_where" endpoint that takes the following optional arguments: county, month, party affiliation, active_status, and limit (the max number of results to return). The endpoint must return a JSON-formatted output, but the schema is up to you.
- All APIs must be RESTful (see The REST API in five minutes for some background if you need it). 

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