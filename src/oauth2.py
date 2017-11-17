from oauth2client.client import OAuth2WebServerFlow

flow =  OAuth2WebServerFlow(client_id="578822069853-m6bvp5ltghui0f1ilf0d0lbfojin7kur.apps.googleusercontent.com",client_secret="ohq1HSoxw2Ql_qVdPIrdMca0",scope="openid",redirect_uri="http://localhost:8080/profile")

def python_flow():
    auth_uri = flow.step1_get_authorize_url()
    return auth_uri

def exchange(code):
    credentials = flow.step2_exchange(code=code)
    return credentials
