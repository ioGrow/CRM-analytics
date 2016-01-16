import httplib2
from apiclient.discovery import build

from config import config
from models.google_credential import GoogleCredential
from services.authentication_service import AuthenticationService
from flask import request, jsonify

auth = AuthenticationService(config)


def google_oauth2_callback():
    r = request.json
    credentials = auth.google_flow(r['redirectUri']).step2_exchange(r['code'])
    http = credentials.authorize(httplib2.Http())
    service = build('oauth2', 'v2', http=http)
    data = service.userinfo().get().execute()
    user = GoogleCredential.query(GoogleCredential.google_id == data['id']).get()
    if user:
        token = auth.create_token(user.key)
        return jsonify(token=token)
    user = GoogleCredential(credential=credentials.to_json(), google_id=data['id'], first_name=data['given_name'],
                            picture=data['picture'], last_name=data['family_name'], email=data['email']).put()
    token = auth.create_token(user)
    return jsonify(token=token, first_time=True)
