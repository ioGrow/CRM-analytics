from app.config import config
from intercom import Intercom, User

__author__ = 'GHIBOUB Khalid'

Intercom.app_id = config.get('intercom_app_id')
Intercom.app_api_key = config.get('intercom_app_api_key')
print(User.count())



