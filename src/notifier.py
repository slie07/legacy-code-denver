import smtplib

from email.mime.text import MIMEText

fromaddr = 'spvankina+13@gmail.com'
allowed_emails = open('security/allowed_emails.txt').read().splitlines()


server = None

def start_server():
    global server
    server = smtplib.SMTP('localhost')

def sendmail(toaddrs, message):
    if toaddrs in allowed_emails:
        msg = MIMEText(message)
        msg['Subject'] = "You've got a message!"
        msg['From'] = 'Senseus <spvankina+senseus.c14@gmail.com>'
        msg['To'] = toaddrs

        server.sendmail(fromaddr, toaddrs, msg.as_string())

def stop_server():
    server.quit()

def notify(conversation_participants, message, sending_user_id, sending_user_email=None):
    email_participants = conversation_participants['email']
    if sending_user_email:
        email_participants = [x for x in conversation_participants['email'] if x != sending_user_email]

    if len(email_participants) > 0:
        email_participants = ','.join(conversation_participants['email'])
        sendmail(email_participants, message)

