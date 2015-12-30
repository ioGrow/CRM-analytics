import json
from datetime import datetime

from apiclient.errors import HttpError

from app.api import BaseResource
from app.models.google_credential import GoogleAnalyticsCredential
from app.services.google_analytics_service import GoogleAnalyticsService
from flask.ext.restful import inputs
from flask_restful import reqparse, abort

parser = reqparse.RequestParser()
parser.add_argument('profile_id')
parser.add_argument('startDate', type=inputs.date, help='Rate cannot be converted')
parser.add_argument('endDate', type=inputs.date, help='Rate cannot be converted')


class Profile(BaseResource):
    def get(self):
        return {'profile_id': self.g_analytics_credential.profile_id}


class Property(BaseResource):
    def __init__(self):
        super(Property, self).__init__()

    def get(self):
        try:
            service = GoogleAnalyticsService(self.g_credential)
            properties = service.get_all_profiles_with_properties()
        except HttpError, e:
            abort(404, message=json.loads(e.content).get("error").get("message"))
        return {'properties': properties}

    def post(self):
        args = parser.parse_args()
        GoogleAnalyticsCredential(google_credential=self.g_credential.key, profile_id=args["profile_id"]).put()
        return {'profile_id': args["profile_id"]}, 201


class GANewVisitors(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = GoogleAnalyticsService(self.g_credential)
        analytics_credential = GoogleAnalyticsCredential.get_by_user_id(self.g_credential.key.id())
        if not analytics_credential:
            abort(404, message="there are no Google analytics account associated to this user ")
        profile_id = analytics_credential.profile_id
        end_date = args["endDate"].strftime('%Y-%m-%d')
        start_date = args["startDate"].strftime('%Y-%m-%d')
        data_by_date = service.get_data_by_date(profile_id, ['uniquePageViews'], ['pagePath=~welcome'], start_date,
                                                end_date).get('rows')
        result = []
        for row in data_by_date:
            date = datetime.strptime(row[0], '%Y%m%d')
            result.append([row[1], str(date)])
        return {'data': result}


class GABounceRate(BaseResource):
    def get(self):
        args = parser.parse_args()
        end_date = args["endDate"].strftime('%Y-%m-%d')
        start_date = args["startDate"].strftime('%Y-%m-%d')
        analytics_service = GoogleAnalyticsService(self.g_credential)
        analytics_credential = GoogleAnalyticsCredential.get_by_user_id(self.g_credential.key.id())
        if not analytics_credential:
            abort(404, message="there are no Google analytics account associated to this user.")
        profile_id = analytics_credential.profile_id

        data_by_date = analytics_service.get_data_by_date(profile_id, ['bounceRate'], [], start_date, end_date).get(
            'rows')
        result = []
        for row in data_by_date:
            date = datetime.strptime(row[0], '%Y%m%d')
            result.append([row[1], str(date)])
        return {'data': result}


class Accounts(BaseResource):
    def get(self):
        resp = {'google_analytics': None}
        analytics_credential = GoogleAnalyticsCredential.get_by_user_id(self.g_credential.key.id())
        if analytics_credential:
            resp['google_analytics'] = analytics_credential.profile_id
        return resp
