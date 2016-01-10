from app.api import BaseResource
from app.config import config
from app.services.intercom_service import IntercomService
from flask.ext.restful import inputs
from flask_restful import reqparse

parser = reqparse.RequestParser()
parser.add_argument('startDate', type=inputs.date, help='Rate cannot be converted')
parser.add_argument('endDate', type=inputs.date, help='Rate cannot be converted')


class TotalUsers(BaseResource):
    def get(self):
        args = parser.parse_args()
        end_date = args["endDate"]
        start_date = args["startDate"]
        service = IntercomService(config.get("intercom_app_id"), config.get("intercom_app_api_key"))
        resp = service.new_visitors(start_date, end_date)
        return {'data': resp}


class GrowthRate(BaseResource):
    def get(self):
        args = parser.parse_args()
        end_date = args["endDate"]
        start_date = args["startDate"]
        service = IntercomService(config.get("intercom_app_id"), config.get("intercom_app_api_key"))
        growth_rate = service.growth_rate(start_date, end_date)
        return {'data': growth_rate}
