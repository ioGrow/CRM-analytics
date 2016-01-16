import json
from datetime import datetime

from apiclient.errors import HttpError

from api import BaseResource
from config import config
from models.google_credential import GoogleAnalyticsCredential
from services.google_analytics_service import GoogleAnalyticsService
from services.mixpanel_service import MixPanelService
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

        data_by_date = service.get_data_by_date(profile_id, ['uniquePageViews'], ['pagePath=~welcome'],
                                                args["startDate"],
                                                args["endDate"]).get('rows')
        result = []
        for row in data_by_date:
            date = datetime.strptime(row[0], '%Y%m%d')
            result.append([row[1], str(date)])
        return {'data': result}


def prepare_response(data):
    result = []
    for row in data:
        date = datetime.strptime(row[0], '%Y%m%d')
        result.append([row[1], str(date)])
    return result


class GANewVisitorsBySource(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = GoogleAnalyticsService(self.g_credential)
        analytics_credential = GoogleAnalyticsCredential.get_by_user_id(self.g_credential.key.id())
        if not analytics_credential:
            abort(404, message="there are no Google analytics account associated to this user ")
        profile_id = analytics_credential.profile_id
        data_by_source = service.get_data_by_source(profile_id, ['uniquePageViews'], ['pagePath=~welcome'],
                                                    args["startDate"],
                                                    args["endDate"]).get('rows')
        return {'data': data_by_source}


class GABounceRate(BaseResource):
    def get(self):
        args = parser.parse_args()
        analytics_service = GoogleAnalyticsService(self.g_credential)
        analytics_credential = GoogleAnalyticsCredential.get_by_user_id(self.g_credential.key.id())
        if not analytics_credential:
            abort(404, message="there are no Google analytics account associated to this user.")
        profile_id = analytics_credential.profile_id

        data_by_date = analytics_service.get_data_by_date(profile_id, ['bounceRate'], ['pagePath=~welcome'],
                                                          args["startDate"],
                                                          args["endDate"]).get(
            'rows')

        return {'data': prepare_response(data_by_date)}


class ConversionRates(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = GoogleAnalyticsService(self.g_credential)
        analytics_credential = GoogleAnalyticsCredential.get_by_user_id(self.g_credential.key.id())
        if not analytics_credential:
            abort(404, message="there are no Google analytics account associated to this user ")
        profile_id = analytics_credential.profile_id
        visitors = service.get_data_by_date(profile_id, ['uniquePageViews'], ['pagePath=~welcome'], args["startDate"],
                                            args["endDate"]).get('rows')
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        new_users = service.daily_new_users(args["startDate"], args["endDate"])
        conversion_rates = []
        for index, user in enumerate(new_users):
            visitor = visitors[index]
            rate = user[0] * 100 / float(int(visitor[1]))
            item = [round(rate, 2), user[1]]
            conversion_rates.append(item)
        return {'data': conversion_rates}


class Accounts(BaseResource):
    def get(self):
        resp = {'google_analytics': None}
        analytics_credential = GoogleAnalyticsCredential.get_by_user_id(self.g_credential.key.id())
        if analytics_credential:
            resp['google_analytics'] = analytics_credential.profile_id
        return resp
