from api import BaseResource
from config import config
from services.intercom_service import IntercomService
from flask.ext.restful import inputs
from flask_restful import reqparse

parser = reqparse.RequestParser()
parser.add_argument('startDate', type=inputs.date, help='Rate cannot be converted')
parser.add_argument('endDate', type=inputs.date, help='Rate cannot be converted')


class TotalUsers(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = IntercomService(config.get("intercom_app_id"), config.get("intercom_app_api_key"))
        resp = service.total_users(args["startDate"], args["endDate"])
        return {'data': resp}


class GrowthRate(BaseResource):
    def get(self):
        args = parser.parse_args()
        service = IntercomService(config.get("intercom_app_id"), config.get("intercom_app_api_key"))
        growth_rate = service.growth_rate(args["startDate"], args["endDate"])
        return {'data': growth_rate}
