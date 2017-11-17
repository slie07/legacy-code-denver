import imaplib
import email
import datetime
import re
import db
import notifier
import time
from datetime import datetime as dt

mail = None

def connect_to_server():
    global mail
    mail = imaplib.IMAP4_SSL('imap.gmail.com')
    password = open('security/gmail_password.txt').read()

    mail.login('spvankina@gmail.com', password)
    mail.list()
    # Out: list of "folders" aka labels in gmail.
    mail.select("inbox") # connect to inbox.

def get_new_mail():
    date = (datetime.date.today() - datetime.timedelta(1)).strftime("%d-%b-%Y")
    result, data = mail.uid('search', None, '(UNSEEN)')

    new_mail = []

    ids = data[0] # data is a list.
    id_list = ids.split() # ids is a space separated string
    if len(id_list) > 0:
        for id in id_list:
            result, data = mail.uid('fetch', id, "(RFC822)") # fetch the email body (RFC822) for the given ID
            raw_email = data[0][1] # here's the body, which is raw text of the whole email
## including headers and alternate payloads
            msg = email.message_from_string(raw_email)

            if msg['To'].startswith('spvankina+senseus.'):
                new_mail.append(msg)

    return new_mail

def create_messages_from_mail(new_mail):
    for mail in new_mail:
        conversation_id = int(mail['To'].lstrip('spvankina+senseus.c').rstrip('@gmail.com'))
        message = mail.get_payload()[0].get_payload()
        sent_date = dt.utcnow()
        sending_user_id = 0
        sending_user_email = re.search('\<(.*?)\>', mail['From']).groups()[0]
        db.create_message(conversation_id, message, sent_date, sending_user_id)
        db.update_conversation_preview(conversation_id, message, sent_date, sending_user_id)
        notifier.notify(db.get_conversation_participants(conversation_id), message, sending_user_id, sending_user_email=sending_user_email)


connect_to_server()
while True:
    new_mail = get_new_mail()
    if len(new_mail) > 0:
        print 'Creating messages from mail!'
        print new_mail
        create_messages_from_mail(new_mail)

    print 'Sleeping 5'
    time.sleep(5)

