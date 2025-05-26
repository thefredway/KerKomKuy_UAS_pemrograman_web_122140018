from pyramid.config import Configurator
from .views.user import *

def main(global_config, **settings):    
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.routes')
        config.include('.models')
        config.include('pyramid_tm')

        # === ROUTES USER ===
        config.add_route('users', '/api/users')
        config.add_route('get_user', '/api/users/{id}')
        config.add_route('update_user', '/api/users/{id}')
        config.add_route('delete_user', '/api/users/{id}')

        config.scan()
    return config.make_wsgi_app()
