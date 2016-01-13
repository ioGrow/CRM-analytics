from datetime import timedelta

from google.appengine.api import memcache

from intercom import Intercom, User

__author__ = 'GHIBOUB Khalid'


class IntercomService(object):
    def __init__(self, app_id, app_api_key):
        super(IntercomService, self).__init__()
        Intercom.app_id = app_id
        Intercom.app_api_key = app_api_key

    def total_users(self, s_date, e_date):
        key = 'total_users_' + s_date.strftime('%Y-%m-%d') + e_date.strftime('%Y-%m-%d')
        visitors_from_cache = memcache.get(key)
        if visitors_from_cache:
            return visitors_from_cache
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
        memcache.add(key, result, 180)
        return result

    def growth_rate(self, s_date, e_date):
        new_visitors = self.total_users(s_date, e_date)
        resp = []
        length = len(new_visitors)
        for index in range(0, length):
            if index == length - 1:
                break
            rate = (new_visitors[index + 1][0] - new_visitors[index][0]) * 100 / float(new_visitors[index + 1][0])
            resp.append([round(rate, 2), new_visitors[index + 1][1]])
        return resp
