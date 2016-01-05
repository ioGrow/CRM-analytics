import os

__author__ = 'GHIBOUB Khalid'

config = {
    # intercom app id and key
    "intercom_app_id": "s9iirr8w",
    "intercom_app_api_key": "ae6840157a134d6123eb95ab0770879367947ad9",

    # mixpanel app id and key
    "mixpanel_api_key": "dfcebb832b4a5874293a390a2abae928",
    "mixpanel_api_secret": "6c9799e849a336b121e785e2321dca11",

    # Google oauth2 web client config
    "google_client_id": "54646190950-4a0vuan4eerv99ro226trhsl93mmh65r.apps.googleusercontent.com",
    "google_client_secret": "cLR6edtZu4LvxfBHR77wIFjc",

    # JWT Token Secret config
    "token_secret": os.environ.get('SECRET_KEY') or '4a0vuau4LvxfBHRro226trhsl93mmh65r'
}
