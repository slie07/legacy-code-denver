import psycopg2
import json
from collections import defaultdict
import xxhash
from datetime import datetime as dt

conn = psycopg2.connect(database="senseus")

def select_for_user(senseus_id, select_clause):
    cur = conn.cursor()
    cur.execute(select_clause, (senseus_id,))
    return cur.fetchall()

def get_events(senseus_id):
    select_clause = """select e.event_id,e.event_name, e.event_info from user_events ue
                        join events e on ue.event_id = e.event_id
                        where ue.user_id = %s"""
    return select_for_user(senseus_id, select_clause)

def get_event(event_id):
    select_clause = """select e.event_id, e.event_name, e.event_info from events e where e.event_id = %s"""
    cur = conn.cursor()
    cur.execute(select_clause, (event_id,))
    return cur.fetchone()

def get_circles(senseus_id):
    select_clause = """select uc.circle_id, uc.circle_name, c.circle_info
                       from user_circles uc join circles c
                       on uc.circle_id = c.circle_id
                       where uc.user_id = %s"""
    return select_for_user(senseus_id, select_clause)

def get_notifications(senseus_id):
    select_clause = """select notification, is_new, notification_info, date from user_notifications where user_id = %s and is_new order by date desc"""
    results = select_for_user(senseus_id, select_clause)
    for result in results:
        result = list(result)
        result[2] = json.loads(result[2])
    return results


def get_conversations(senseus_id):
    select_clause = """select c.conversation_id, c.conversation_preview,
                              c.conversation_name, c.last_updated
                        from conversations c join
                        user_conversations uc on c.conversation_id = uc.conversation_id
                        where uc.user_id = %s
                        order by c.last_updated desc"""
    return select_for_user(senseus_id, select_clause)

def get_conversation_messages(senseus_id, conversation_id):
    select_clause = """select * from conversation_messages where conversation_id = %s"""
    cur = conn.cursor()
    cur.execute(select_clause, (conversation_id,))
    return cur.fetchall()

def get_new_messages(senseus_id, conversation_id, last_updated):
    select_clause = """select * from conversation_messages where conversation_id = %s and sent_date > %s"""
    cur = conn.cursor()
    cur.execute(select_clause, (conversation_id, last_updated))
    return cur.fetchall()

def create_event(event_info):
    event_name = event_info['eventName']
    event_info = json.dumps(event_info)
    insert_clause = """insert into events (event_info, event_name) values (%s, %s) returning event_id"""
    cur = conn.cursor()
    cur.execute(insert_clause, (event_info, event_name))
    result = cur.fetchone()
    conn.commit()
    return result

def create_user_event(senseus_id, event_id):
    insert_clause = "insert into user_events (user_id, event_id, due_date) values (%s, %s, %s)"
    cur = conn.cursor()
    cur.execute(insert_clause, (senseus_id, event_id, None))
    conn.commit()
    return True

def create_user_notification(senseus_id, notification, create_date, notification_info):
    insert_clause = "insert into user_notifications (user_id, notification, is_new, date, notification_info) values (%s, %s, %s, %s, %s)"
    cur = conn.cursor()
    cur.execute(insert_clause, (senseus_id, notification, True, create_date, notification_info))
    conn.commit()
    return True

def select_or_create_user(user_id, name, email, login_type):
    select_statement = "SELECT id from user_info where user_id = %s and login=%s"
    cur = conn.cursor()
    cur.execute(select_statement, (user_id, login_type))
    results = cur.fetchall()
    if not results:
        insert_statement = "INSERT into user_info (username, useremail, user_id, login) values (%s, %s, %s, %s) returning id"
        result = cur.execute(insert_statement, (name, email, user_id, login_type))
        print result
        conn.commit()
        print "Inserted"
        id_to_return = result
    else:
        print "Already Exists", results
        id_to_return = results[0][0]

    response_obj = {'email': email, 'name': name, 'id': id_to_return}
    return response_obj

def create_message(conversation_id, message, send_date, sending_user_id):
    insert_statement = "INSERT into conversation_messages values (%s, %s, %s, %s)"
    cur = conn.cursor()
    cur.execute(insert_statement, (conversation_id, message, send_date, sending_user_id))
    conn.commit()
    return True

def update_conversation_preview(conversation_id, message, send_date, sending_user_id):
    update_statement = "UPDATE conversations set conversation_preview=%s, last_updated=%s where conversation_id=%s";
    cur = conn.cursor()
    cur.execute(update_statement, (message, send_date, conversation_id))
    conn.commit()
    return True

def get_conversation_participants(conversation_id):
    select_clause = "select * from conversation_participants where conversation_id = %s"
    cur = conn.cursor()
    cur.execute(select_clause, (conversation_id,))
    results = cur.fetchall()
    to_return = defaultdict(list)
    for result in results:
        to_return[result[1]].append(result[2])

    return to_return

def find_or_create_conversation(participants, senseus_id, conversation_preview, last_updated):
    x = xxhash.xxh64()
    x.update(participants)
    participants = json.loads(participants)
    participants_hash = x.hexdigest()
    conversation_name = participants[0]['name']
    if len(participants) > 1:
        conversation_name += '+'+len(participants)+' Others'

    select_clause = "select conversation_id from conversation_participants_hash where participants_hash = %s"
    cur = conn.cursor()
    cur.execute(select_clause, (participants_hash,))
    result = cur.fetchone()

    if result:
        print 'Conversation exists! returning', result[0]
        return result[0]

    insert_conversation = "insert into conversations (conversation_name, last_updated, conversation_preview) values (%s, %s, %s) returning conversation_id"
    insert_participants = "insert into conversation_participants (conversation_id, member_type, participant_info) values"
    insert_hash = "insert into conversation_participants_hash (conversation_id, participants_hash) values (%s, %s)"
    insert_user_conversations = "insert into user_conversations (user_id, conversation_id) values (%s, %s)"
    cur = conn.cursor()
    cur.execute(insert_conversation, (conversation_name, last_updated, conversation_preview))
    conversation_id = cur.fetchone()[0]
    part_params = [(conversation_id, p['type'], p['email']) for p in participants]
    part_args = ','.join(cur.mogrify('(%s, %s, %s)', part) for part in part_params)
    cur.execute(insert_participants + part_args)
    cur.execute(insert_hash, (conversation_id, participants_hash))
    cur.execute(insert_user_conversations, (senseus_id, conversation_id))
    conn.commit()
    return conversation_id

def get_user_settings(senseus_id):
    select_clause = "select settings from user_settings where user_id = %s"
    return select_for_user(senseus_id, select_clause)[0][0]

def update_user_settings(senseus_id, settings):
    update_clause = "update user_settings set settings = %s where user_id = %s"
    cur = conn.cursor()
    cur.execute(update_clause, (settings, senseus_id))
    conn.commit()
    return True

