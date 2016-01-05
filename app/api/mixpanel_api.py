from app.api import BaseResource
from app.config import config
from app.services.authentication_service import AuthenticationService
from app.services.mixpanel_service import MixPanelService
from flask.ext.restful import inputs
from flask.ext.restful import reqparse

auth = AuthenticationService(config)
parser = reqparse.RequestParser()
parser.add_argument('startDate', type=inputs.date, help='Rate cannot be converted')
parser.add_argument('endDate', type=inputs.date, help='Rate cannot be converted')


class WeeklyNewUsers(BaseResource):
    def get(self):
        args = parser.parse_args()
        end_date = args["endDate"].strftime('%Y-%m-%d')
        start_date = args["startDate"].strftime('%Y-%m-%d')
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        weekly_new_users = service.weekly_new_users(start_date, end_date)
        return {'data': weekly_new_users}


class ClicksByUsers(BaseResource):
    def get(self):
        args = parser.parse_args()
        end_date = args["endDate"].strftime('%Y-%m-%d')
        start_date = args["startDate"].strftime('%Y-%m-%d')
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        clicks_by_users = service.sign_in_clicker_and_users_ratio(start_date, end_date)
        return {'data': clicks_by_users}


class DailyNewUsers(BaseResource):
    def get(self):
        args = parser.parse_args()
        end_date = args["endDate"].strftime('%Y-%m-%d')
        start_date = args["startDate"].strftime('%Y-%m-%d')
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        daily_new_users = service.daily_new_users(start_date, end_date)
        return {'data': daily_new_users}
