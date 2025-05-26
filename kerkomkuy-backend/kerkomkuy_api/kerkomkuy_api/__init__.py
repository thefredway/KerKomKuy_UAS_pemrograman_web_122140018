from pyramid.config import Configurator
from .views.user import *
from .views.auth import *

def main(global_config, **settings):    
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.routes')
        config.include('.models')
        config.include('pyramid_tm')

        # === ROUTES ===
        config.add_route('users', '/api/users')               # GET all / POST
        config.add_route('user_detail', '/api/users/{id}')    # GET / PUT / DELETE

        config.add_route('login', '/api/login')
        config.scan()
    return config.make_wsgi_app()
