from datetime import datetime, timedelta
from functools import wraps

from oauth2client import client

import jwt
from flask import g, request, jsonify
from jwt import DecodeError, ExpiredSignature

__author__ = 'GHIBOUB Khalid'


class AuthenticationService(object):
    def __init__(self, config):
        self.token_secret = config.get('token_secret')
        self.google_client_id = config.get('google_client_id')
        self.google_client_secret = config.get('google_client_secret')

    def create_token(self, user):
        payload = {
            'sub': user.id(),
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(days=14)
        }
        token = jwt.encode(payload, self.token_secret)
        return token.decode('unicode_escape')

    def parse_token(self, req):
        token = req.headers.get('Authorization').split()[1]
        return jwt.decode(token, self.token_secret)

    def google_flow(self, callback_url):
        return client.OAuth2WebServerFlow(client_id=self.google_client_id,
                                          client_secret=self.google_client_secret,
                                          scope=['https://www.googleapis.com/auth/plus.me',
                                                 'https://www.googleapis.com/auth/analytics',
                                                 'https://www.googleapis.com/auth/analytics.edit',
                                                 'https://www.googleapis.com/auth/analytics.manage.users',
                                                 'https://www.googleapis.com/auth/analytics.manage.users.readonly',
                                                 'https://www.googleapis.com/auth/analytics.provision',
                                                 'https://www.googleapis.com/auth/analytics.readonly',
                                                 'https://www.googleapis.com/auth/userinfo.email',
                                                 ],
                                          redirect_uri=callback_url)

    def login_required(self, f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.headers.get('Authorization'):
                response = jsonify(message='Missing authorization header')
                response.status_code = 401
                return response

            try:
                payload = self.parse_token(request)
            except DecodeError:
                response = jsonify(message='Token is invalid')
                response.status_code = 401
                return response
            except ExpiredSignature:
                response = jsonify(message='Token has expired')
                response.status_code = 401
                return response

            g.user_id = payload['sub']

            return f(*args, **kwargs)

        return decorated_function
