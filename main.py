from app.api.google_analytics_api import Profile, GANewVisitors, GABounceRate, Accounts, GANewVisitorsBySource, \
    ConversionRates
from app.api.google_analytics_api import Property
from app.api.intercom_api import TotalUsers, GrowthRate
from app.api.mixpanel_api import DailyNewUsers, ClicksByUsers, DailyActiveUsers, DailyActiveUsersGrowth, \
    EngagedUsers, WeeklyActiveUsers, WeeklyActiveUsersGrowth
from app.handlers.auth.google import google_oauth2_callback
from flask import Flask
from flask.ext.restful import Api

__author__ = 'GHIBOUB Khalid'

app = Flask(__name__)
api = Api(app)
api_root = '/report/api/v1.0'

api.add_resource(Profile, api_root + '/profile')
api.add_resource(Property, '/properties')
api.add_resource(GANewVisitors, '/new_visitors')
api.add_resource(GABounceRate, '/bounce_rate')
api.add_resource(Accounts, '/accounts')
api.add_resource(DailyNewUsers, '/daily_new_users')
api.add_resource(TotalUsers, '/total_users')
api.add_resource(GANewVisitorsBySource, '/new_users_by_source')
api.add_resource(ConversionRates, '/conversion_rates')
api.add_resource(ClicksByUsers, '/click_by_users')
api.add_resource(GrowthRate, '/growth_rate')
api.add_resource(DailyActiveUsers, '/daily_active_users')
api.add_resource(DailyActiveUsersGrowth, '/daily_active_users_growth')
api.add_resource(WeeklyActiveUsers, '/weekly_active_users')
api.add_resource(WeeklyActiveUsersGrowth, '/weekly_active_users_growth')
api.add_resource(EngagedUsers, '/weekly_engaged_users')
app.add_url_rule('/auth/google', 'google_auth', google_oauth2_callback, methods=['GET', 'POST'])

