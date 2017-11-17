#! /usr/bin/env python
from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from wsgicors import CORS
from src.controller import *
import os
from pyramid.response import FileResponse
from src.notifier import start_server

def add_standard_view_route(config, view_name, view_function):
    config.add_route(view_name, '/'+view_name)
    config.add_view(view_function, route_name=view_name)

def favicon_view(request):
    here = os.path.dirname(__file__)
    icon = os.path.join(here, 'static', 'favicon.ico')
    return FileResponse(icon, request=request)

if __name__ == '__main__':
    config = Configurator()
    config.add_route('home', '/')
    config.add_route('profile', '/profile')
    config.add_route('login', '/login')
    config.add_route('facebook_login', '/facebook_login')
    config.add_route('notifications', '/notifications')
    config.add_view(home, route_name='home')
    config.add_view(profile, route_name='profile')
    config.add_view(login, route_name='login')
    #config.add_view(events_and_circles, route_name='events_and_circles')
    config.add_view(notifications, route_name='notifications')
    add_standard_view_route(config, 'conversations', conversations)
    add_standard_view_route(config, 'get_contacts', get_contacts)
    add_standard_view_route(config,'events', events)
    add_standard_view_route(config, 'circles', circles)
    add_standard_view_route(config, 'events_and_circles', events_and_circles)
    add_standard_view_route(config, 'conversation_messages', conversation_messages)
    add_standard_view_route(config, 'new_conversation_messages', new_conversation_messages)
    add_standard_view_route(config, 'get_or_create_conversation', get_or_create_conversation)
    config.add_route('create_event', '/create_event')
    config.add_view(create_event, route_name='create_event', request_method='POST')
    config.add_route('send_message', '/send_message')
    config.add_view(send_message, route_name='send_message', request_method='POST')
    config.add_view(facebook_login, route_name='facebook_login', request_method='POST')
    config.add_route('favicon', '/favicon.ico')
    config.add_view(favicon_view, route_name='favicon')
    config.add_route('settings', '/settings')
    config.add_view(get_settings, route_name='settings', request_method='GET')
    config.add_view(set_settings, route_name='settings', request_method='POST')

    config.add_static_view(name='static', path='static')
    app = CORS(config.make_wsgi_app(), headers="*", methods="*", maxage="180", origin="*")
    server = make_server('0.0.0.0', 8080, app)
    print "Starting server on port 8080"
    #start_server()
    server.serve_forever()

