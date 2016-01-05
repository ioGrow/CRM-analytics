from app.api import BaseResource
from app.models.google_credential import GoogleAnalyticsCredential
from flask.ext.restful import inputs
from flask_restful import reqparse

parser = reqparse.RequestParser()
parser.add_argument('startDate', type=inputs.date, help='Rate cannot be converted')
parser.add_argument('endDate', type=inputs.date, help='Rate cannot be converted')


class Accounts(BaseResource):
    def get(self):
        resp = {'google_analytics': None}
        analytics_credential = GoogleAnalyticsCredential.get_by_user_id(self.g_credential.key.id())
        if analytics_credential:
            resp['google_analytics'] = analytics_credential.profile_id
        return resp
