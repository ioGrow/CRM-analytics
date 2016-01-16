from google.appengine.ext import ndb

from models import BaseModel

__author__ = 'GHIBOUB Khalid'


class GoogleCredential(BaseModel):
    credential = ndb.JsonProperty(required=True)
    google_id = ndb.StringProperty()
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()
    email = ndb.StringProperty()
    picture = ndb.StringProperty()


class GoogleAnalyticsCredential(BaseModel):
    google_credential = ndb.KeyProperty(kind=GoogleCredential, required=True)
    profile_id = ndb.StringProperty()

    @classmethod
    def get_by_user_id(cls, user_id):
        g_credential = GoogleCredential.get_by_id(user_id)
        return cls.query(cls.google_credential == g_credential.key).get()
