from datetime import date

from dateutil import parser

__author__ = 'GHIBOUB Khalid'


def days_between_two_date(start_date, end_date):
    start_date = parser.parse(start_date)
    end_date = parser.parse(end_date)
    return (end_date - start_date).days + 1


def weeks_between_two_date(start_date, end_date):
    days = days_between_two_date(start_date, end_date)
    weeks = int(days / 7) + (days % 7 > 0)
    return weeks


def get_interval_valid_dates(end_date, start_date):
    today = str(date.today())
    interval = days_between_two_date(start_date, today)
    dates = days_between_two_date(start_date, end_date)
    return dates, interval
