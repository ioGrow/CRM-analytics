import os

__author__ = 'GHIBOUB Khalid'

config = {
    # intercom app id and key
    "intercom_app_id": "my_app_id",
    "intercom_app_api_key": "my-super-crazy-api-key",

    # Google oauth2 web client config
    "google_client_id": "54646190950-4a0vuan4eerv99ro226trhsl93mmh65r.apps.googleusercontent.com",
    "google_client_secret": "cLR6edtZu4LvxfBHR77wIFjc",

    # JWT Token Secret config
    "token_secret": os.environ.get('SECRET_KEY') or '4a0vuau4LvxfBHRro226trhsl93mmh65r'
}
