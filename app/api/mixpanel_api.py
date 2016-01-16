from api import BaseResource
from config import config
from services.authentication_service import AuthenticationService
from services.mixpanel_service import MixPanelService
from flask.ext.restful import inputs
from flask.ext.restful import reqparse

auth = AuthenticationService(config)
parser = reqparse.RequestParser()
parser.add_argument('startDate', type=inputs.date, help='Rate cannot be converted')
parser.add_argument('endDate', type=inputs.date, help='Rate cannot be converted')
parser.add_argument('dailyActions', type=int, help='you have to send daily actions')
parser.add_argument('weeklyActions', type=int, help='you have to send actions')
parser.add_argument('periodActions', type=int, help='you have to send actions')
parser.add_argument('periodDays', type=int, help='you have to send actions')


class ClicksByUsers(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        clicks_by_users = service.sign_in_clicker_and_users_ratio(args["startDate"], args["endDate"])
        return {'data': clicks_by_users}


class PeriodicallyActiveUsers(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        active_users = service.get_periodically_active_users(args["startDate"], args["endDate"],
                                                             args["periodActions"], args["periodDays"])
        return {'data': active_users}


class PeriodicallyActiveUsersGrowth(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        active_users = service.get_active_users_growth_by_period(args["startDate"], args["endDate"],
                                                                 args["periodActions"], args["periodDays"])
        return {'data': active_users}


class PeriodicallyEngagedUsers(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        engaged_users = service.get_engaged_users_by_period(args["startDate"], args["endDate"], args["periodActions"],
                                                            args["periodDays"])
        return {'data': engaged_users}


# class WeeklyActiveUsers(BaseResource):
#     def get(self):
#         args = parser.parse_args()
#         service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
#         active_users = service.get_periodically_active_users(args["startDate"], args["endDate"],
#                                                              args["weeklyActions"], 7)
#         return {'data': active_users}
#
#
# class WeeklyActiveUsersGrowth(BaseResource):
#     def get(self):
#         args = parser.parse_args()
#         week_actions = args["weeklyActions"]
#         service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
#         active_users = service.get_active_users_growth_by_period(args["startDate"], args["endDate"], week_actions, 7)
#         return {'data': active_users}





class ChurnedUsers(BaseResource):
    def get(self):
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        return {'data': (service.get_churn_users())}


class LifeTimeChurnedUsers(BaseResource):
    def get(self):
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        return {'data': (service.get_life_time_churned_users())}


class DailyNewUsers(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = MixPanelService(config.get("mixpanel_api_key"), config.get("mixpanel_api_secret"))
        daily_new_users = service.daily_new_users(args["startDate"], args["endDate"])
        return {'data': daily_new_users}
