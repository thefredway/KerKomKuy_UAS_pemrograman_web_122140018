from pyramid.config import Configurator
from .views.user import *
from .views.auth import *
from .views.jadwal import *
from .views.grup import *
from .views.chat import *

from pyramid.config import Configurator
from pyramid.events import NewRequest
from pyramid.view import view_config
from pyramid.response import Response

# Add new OPTIONS view handler for preflight requests
@view_config(route_name='options_preflight', request_method='OPTIONS')
def options_view(request):
    response = Response()
    response.headers.update({
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',  # 24 hours
    })
    return response

def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',  # 24 hours
        })
        return response
    event.request.add_response_callback(cors_headers)
    
def main(global_config, **settings):    
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.routes')
        config.include('.models')
        config.include('pyramid_tm')
          # Add CORS support
        config.add_subscriber(add_cors_headers_response_callback, NewRequest)
        
        # Add a catch-all OPTIONS route for handling preflight requests
        # This needs to be the first route to ensure it catches all OPTIONS requests
        config.add_route('options_preflight', '/{catch_all:.*}', request_method='OPTIONS')
        
        # === ROUTES ===
        config.add_route('users', '/api/users')               # GET all / POST
        config.add_route('user_detail', '/api/users/{id}')    # GET / PUT / DELETE
        
        config.add_route('login', '/api/login')

        config.add_route('jadwal', '/api/jadwal')              # GET all / POST
        config.add_route('jadwal_detail', '/api/jadwal/{id}')  # GET one / PUT / DELETE

        config.add_route('grup', '/api/grup')              # GET all / POST
        config.add_route('grup_detail', '/api/grup/{id}')  # GET / DELETE

        config.add_route('chat', '/api/chat/{grup_id}')  # GET all chat / POST
        
        config.add_route('ajakan', '/api/ajakan')  # GET all ajakan user / POST ajakan
        config.add_route('ajakan_detail', '/api/ajakan/{id}')  # PUT status ajakan

        config.add_route('cari_jadwal_kosong', '/api/jadwal-kosong')        
        
        config.scan()
    return config.make_wsgi_app()
