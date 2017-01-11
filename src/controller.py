from pyramid.response import Response
from jinja2 import Template
import db
from oauth2client import client, crypt
import psycopg2
import json
from src.oauth2 import python_flow, exchange
from oauth2client import client, crypt
from pyramid.httpexceptions import HTTPFound
import pprint
from datetime import datetime as dt
import notifier
from hashids import Hashids

hashid = Hashids(salt='My very own awesome unique salt!')
CLIENT_ID = "578822069853-m6bvp5ltghui0f1ilf0d0lbfojin7kur.apps.googleusercontent.com"

def home(request):
    return Response(open('html/home.html').read())

def validate_token(token):
    import pdb;pdb.set_trace()
    try:
        idinfo = client.verify_id_token(token, CLIENT_ID)
        import pdb;pdb.set_trace()
        if idinfo['aud'] not in [CLIENT_ID]:
            raise crypt.AppIdentityError("Unrecognized client.")
        if idinfo['iss'] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise crypt.AppIdentityError("Wrong issuer.")
        #if idinfo['hd'] != APPS_DOMAIN_NAME:
            #raise crypt.AppIdentityError("Wrong hosted domain.")
    except crypt.AppIdentityError as ce:
        #Invalid token
        #TODO: Log this person.
        print "Crap", ce
        return None

    return idinfo

def login(request):
    #idinfo = validate_token(request.params['id'])
    user_id = request.params['user_id']
    name = request.params['name']
    email = request.params['email']
    #if idinfo is not None:
        #user_id = idinfo['sub']
        #name = idinfo['name']
        #email = idinfo['email']

    response_obj = db.select_or_create_user(user_id, name, email, request.params['login_type'])
    return Response(json.dumps(response_obj))
    #else:
        #return Response(status=401)

def facebook_login(request):
    params = request.POST.mixed()
    response_obj = db.select_or_create_user(params['id'], params['name'], params['email'], params['login_type'])
    return Response(json.dumps(response_obj))

def profile(request):
    return Response(open('html/main_screen.html').read())


def events_and_circles(request):
    senseus_id = request.params['senseus_id']
    events = db.get_events(senseus_id)
    circles = db.get_circles(senseus_id)
    return_obj = {'events': events, 'circles': circles}
    return Response(json.dumps(return_obj))

def events(request):
    senseus_id = request.params['senseus_id']
    if 'event_id' in request.params:
        event_id = request.params['event_id']
        result = db.get_event(event_id)
    else:
        result = db.get_events(senseus_id)

    return Response(json.dumps(result))

def circles(request):
    senseus_id = request.params['senseus_id']
    circles = db.get_circles(senseus_id)
    return Response(json.dumps(circles))

def notifications(request):
    senseus_id = request.params['senseus_id']
    notifications = [list(x) for x in db.get_notifications(senseus_id)]
    for notification in notifications:
        notification[3] = notification[3].isoformat()
    return Response(json.dumps(notifications))

def conversations(request):
    senseus_id = request.params['senseus_id']
    results = [list(result) for result in db.get_conversations(senseus_id)]
    for result in results:
        result[3] = result[3].isoformat()

    return Response(json.dumps(results))

def conversation_messages(request):
    senseus_id = request.params['senseus_id']
    conversation_id = request.params['conversation_id']
    results = db.get_conversation_messages(senseus_id, conversation_id)
    results = [list(result) for result in results]
    for result in results:
        result[2] = result[2].isoformat()
    results = json.dumps(results)
    return Response(results)

def create_event(request):
    params = request.POST.mixed()
    event_info = json.loads(params['event_info'])
    senseus_id = params['senseus_id']
    result = db.create_event(event_info)
    db.create_user_event(senseus_id, result[0])
    notification = params['user_name'] +' created the event: '+event_info['eventName']
    notification_info = {'type': 'event', 'event_id': result[0]}
    db.create_user_notification(senseus_id, notification, event_info['create_date'], json.dumps(notification_info))
    hashed = hashid.encode(result[0])
    return Response(json.dumps({'event_id': result[0], 'event_hash': hashed}))

def send_message(request):
    params = request.POST.mixed()
    conversation_id = params['conversation_id']
    message = params['message']
    sent_date = params['sent_date']
    sending_user_id = params['senseus_id']
    db.create_message(conversation_id, message, sent_date, sending_user_id)
    db.update_conversation_preview(conversation_id, message, sent_date, sending_user_id)
    notifier.notify(db.get_conversation_participants(conversation_id), message, sending_user_id)
    return Response("{200: 'ok'}")

def new_conversation_messages(request):
    senseus_id = request.params['senseus_id']
    conversation_id = request.params['conversation_id']
    last_updated = request.params['last_updated']
    results = db.get_new_messages(senseus_id, conversation_id, last_updated)
    results = [list(result) for result in results]
    for result in results:
        result[2] = result[2].isoformat()

    return Response(json.dumps(results))


def get_contacts(request):
    filtered = []
    count = 0
    parsed = json.load(open('testing/s.json'))
    for x in parsed['feed']['entry']:
        try:
            filtered.append({'name': x['title']['$t'], 'email': x['gd$email'][0]['address'], 'id': x['gd$email'][0]['address'], 'searchable': x['title']['$t']+' '+x['gd$email'][0]['address']})
        except KeyError as ke:
            count += 1

    print 'Total Errors: ',count
    return Response(json.dumps(filtered))

def get_or_create_conversation(request):
    params = request.POST.mixed()
    participants = params['participants']
    senseus_id = params['senseus_id']
    message = params['message']
    last_updated = dt.utcfromtimestamp(int(params['last_updated']))
    cid = db.find_or_create_conversation(participants, senseus_id, message, last_updated)
    db.create_message(cid, message, last_updated, senseus_id)
    notifier.notify(db.get_conversation_participants(cid), message, senseus_id)
    return Response(str(cid))

def get_settings(request):
    senseus_id = request.params['senseus_id']
    return Response(db.get_user_settings(senseus_id))

def set_settings(request):
    params = request.POST.mixed()
    senseus_id = params['senseus_id']
    settings = params['settings']
    db.update_user_settings(senseus_id, settings)
    return Response(status=200)

