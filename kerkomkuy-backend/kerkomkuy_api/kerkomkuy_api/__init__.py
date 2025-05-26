from pyramid.config import Configurator
from .views.user import *
from .views.auth import *
from .views.jadwal import *
from .views.grup import *

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

        config.add_route('jadwal', '/api/jadwal')              # GET all / POST
        config.add_route('jadwal_detail', '/api/jadwal/{id}')  # GET one / PUT / DELETE

        config.add_route('grup', '/api/grup')              # GET all / POST
        config.add_route('grup_detail', '/api/grup/{id}')  # GET / DELETE
        

        config.scan()
    return config.make_wsgi_app()
