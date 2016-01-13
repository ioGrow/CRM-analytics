from datetime import date, datetime

__author__ = 'GHIBOUB Khalid'


def days_between_two_date(start_date, end_date):
    return abs((start_date - end_date).days)


def weeks_between_two_date(start_date, end_date):
    days = days_between_two_date(start_date, end_date)
    weeks = int(days / 7) + (days % 7 > 0)
    return weeks


def get_interval_valid_dates(start_date, end_date):
    interval = days_between_two_date(start_date, datetime.today())
    dates = days_between_two_date(start_date, end_date)
    return dates, interval


def dic_to_sorted_array(dictionary):
    resp = []
    keys = dictionary.keys()
    keys.sort()
    for key in keys:
        resp.append([dictionary[key], key])
    return resp


# list generated from a dic  in the previous method

def to_growth_rate_list(array):
    resp = []
    last_key = None
    for key in array:
        if last_key:
            rate = round(((key[0] - last_key[0]) * 100) / float(key[0]), 2)
            resp.append([rate, key[1]])
        last_key = key
    return resp
