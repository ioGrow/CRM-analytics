from config import config
from models.google_credential import GoogleCredential
from services.authentication_service import AuthenticationService
from flask import g
from flask.ext.restful import Resource, abort

__author__ = 'GHIBOUB Khalid'

auth = AuthenticationService(config)


class BaseResource(Resource):
    @auth.login_required
    def __init__(self):
        super(Resource, self).__init__()
        self.g_credential = GoogleCredential.get_by_id(g.user_id)
        if not self.g_credential:
            abort(404)


