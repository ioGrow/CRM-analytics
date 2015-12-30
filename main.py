from app.api.google_analytics_api import Profile, GANewVisitors, GABounceRate, Accounts
from app.api.google_analytics_api import Property
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
app.add_url_rule('/auth/google', 'google_auth', google_oauth2_callback, methods=['GET', 'POST'])

