from datetime import datetime, timedelta

from intercom import Intercom, User

__author__ = 'GHIBOUB Khalid'


class IntercomService(object):
    def __init__(self, app_id, app_api_key):
        super(IntercomService, self).__init__()
        Intercom.app_id = app_id
        Intercom.app_api_key = app_api_key

    def new_visitors(self, s_date, e_date):
        total_users = User.count() + 470
        interval = {}
        val = 0
        result = []
        # s_date = datetime.strptime(start_date, '%Y-%m-%d')
        # e_date = datetime.strptime(end_date, '%Y-%m-%d')
        days = (e_date - s_date).days + 1

        for item in range(0, days):
            date_str = (e_date - timedelta(days=item)).strftime('%Y-%m-%d')
            interval.update({date_str: 0})

        for user in User.all():
            if s_date > user.created_at:
                break
            if user.created_at > e_date:
                interval[e_date.strftime('%Y-%m-%d')] += 1
                continue
            interval[user.created_at.strftime('%Y-%m-%d')] += 1

        for item in range(0, days):
            date_str = (e_date - timedelta(days=item)).strftime('%Y-%m-%d')
            val += interval.get(date_str)
            result.append([total_users - val, date_str])
        result.reverse()
        return result
