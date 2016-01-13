from collections import Counter
from datetime import datetime, timedelta

from app.utils import get_interval_valid_dates, dic_to_sorted_array, to_growth_rate_list
from app.utils.mixpanel import Mixpanel

__author__ = 'GHIBOUB Khalid'


def get_by_week(active_user, weekly_actions):
    result = {}
    i = 0
    week_actions = 0
    keys = active_user.keys()
    keys.sort()
    for action_date in keys:
        i += 1
        if i % 7 == 0:
            if week_actions >= weekly_actions:
                result[action_date] = 1 if action_date not in result else result[action_date] + 1
            week_actions = 0
            i = 0
        else:
            week_actions += active_user[action_date]
    return result


class MixPanelService(object):
    def __init__(self, api_key, api_secret):
        super(MixPanelService, self).__init__()
        self.api = Mixpanel(
            api_key=api_key,
            api_secret=api_secret
        )

    def daily_new_users(self, start_date, end_date):
        dates, interval = get_interval_valid_dates(start_date, end_date)
        return self.get_event_by_date('SIGNED_UP_SUCCESS', 'day', interval, dates)

    def daily_sign_in_clicks(self, start_date, end_date):
        dates, interval = get_interval_valid_dates(start_date, end_date)
        return self.get_event_by_date('SIGNIN_CLICK', 'day', interval, dates)

    def sign_in_clicker_and_users_ratio(self, start_date, end_date):
        sign_in_clickers = self.daily_sign_in_clicks(start_date, end_date)
        new_users = self.daily_new_users(start_date, end_date)
        result = []
        for index, user in enumerate(new_users):
            sign_in_clicker = sign_in_clickers[index]
            rate = 0 if sign_in_clicker[0] == 0 else float(int(user[0])) * 100 / sign_in_clicker[0]
            item = [round(rate, 2), user[1]]
            result.append(item)
        return result

    def get_daily_active_users_growth(self, start_date, end_date, daily_actions):
        return to_growth_rate_list(self.get_daily_active_users(start_date, end_date, daily_actions))

    def get_weekly_active_users_growth(self, start_date, end_date, weekly_actions):
        return to_growth_rate_list(self.get_weekly_active_users(start_date, end_date, weekly_actions))

    def get_daily_active_users(self, start_date, end_date, daily_actions):
        result = {}
        data = self.active_users_req(start_date, end_date)
        for email, actions_data in data.get('values').iteritems():
            keys = actions_data.keys()
            keys.sort()
            for action_date in keys:
                if actions_data.get(action_date) >= daily_actions:
                    result[action_date] = 1 if action_date not in result else result[action_date] + 1
        return dic_to_sorted_array(result)

    def get_weekly_active_users(self, start_date, end_date, weekly_actions):
        result = {}
        data = self.active_users_req(start_date, end_date)
        for email, actions_data in data.get('values').iteritems():
            i = 0
            week_actions = 0
            keys = actions_data.keys()
            keys.sort()
            for action_date in keys:
                i += 1
                if i % 7 == 0:
                    if week_actions >= weekly_actions:
                        result[action_date] = 1 if action_date not in result else result[action_date] + 1
                    week_actions = 0
                    i = 0
                else:
                    week_actions += actions_data.get(action_date)

        return dic_to_sorted_array(result)

    def active_users_req(self, start_date, end_date):
        return self.segment_request(start_date, end_date, '$custom_event:100587', 'email')

    def get_weekly_engaged_users(self, start_date, end_date, weekly_actions):
        # self.get_churn_users()
        result = {}
        created_users = self.new_users_req(start_date, end_date).get("results")
        active_users = self.active_users_req(start_date, end_date).get('values')

        for user in created_users:
            user_email = user['$properties']['$email']
            if user_email in active_users:
                result.update(Counter(get_by_week(active_users[user_email], weekly_actions)) + Counter(result))
        self.get_churn_users()
        return dic_to_sorted_array(result)

    def get_churn_users(self):
        last_two_moths = (datetime.today() - timedelta(days=60)).strftime('%Y-%m-%d')
        last_month = (datetime.today() - timedelta(days=30)).strftime('%Y-%m-%d')
        created_users_exp = 'not "iogrow.com" in properties["$email"] and properties["$created"] >= datetime("' \
                            + last_two_moths + '") and properties["$created"] <=  datetime("' \
                            + last_month + '")'
        still_active_exp = created_users_exp + ' and properties["$last_seen"] >= datetime("' + last_month + '")'

        still_active_count = self.api.request(['engage'], {'selector': still_active_exp})['total']

        created_users = self.api.request(['engage'], {'selector': created_users_exp})['total']
        churned_users_count = created_users - still_active_count
        result = [['churned users', churned_users_count], ['still active', still_active_count]]
        return result

    def new_users_req(self, start_date, end_date):
        s_date = start_date.strftime('%Y-%m-%d')
        e_date = end_date.strftime('%Y-%m-%d')
        expression = 'not "iogrow.com" in properties["$email"] and properties["$created"] >= datetime("' \
                     + s_date + '") and properties["$created"] <=  datetime("' + e_date + '")'
        created_users = self.api.request(['engage'], {'selector': expression})
        return created_users

    def segment_request(self, start_date, end_date, event, on_property=None, expression=None):
        s_date = start_date.strftime('%Y-%m-%d')
        e_date = end_date.strftime('%Y-%m-%d')

        filter_exp = 'not "iogrow.com" in properties["email"] ' \
                     'and "iogrow.com" in properties["$current_url"]'

        params = {'event': event, 'from_date': s_date, 'to_date': e_date, 'limit': 2000, 'type': 'general',
                  'where': filter_exp}
        if on_property:
            params.update({'on': 'properties["' + on_property + '"]'})
        if expression:
            params.update({'where': expression + ' and ' + filter_exp})

        return self.api.request(['segmentation'], params).get('data')

    def get_event_by_date(self, event, unit, interval, units):
        data = self.api.request(['events'],
                                {'event': [event], 'unit': unit, 'interval': interval,
                                 'type': 'unique'}).get('data')
        result = []
        for item in data.get('series'):
            if units == 0:
                break
            result.append([data.get('values').get(event).get(item), item])
            units -= 1
        return result
