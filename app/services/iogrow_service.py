import httplib2
from apiclient.discovery import build

from oauth2client import client


class IoGrowService(object):
    def __init__(self, google_credential):
        g_credentials = client.OAuth2Credentials.from_json(google_credential.credential)
        http = httplib2.Http()
        if g_credentials.access_token_expired:
            g_credentials.refresh(http)
            google_credential.credential = g_credentials.to_json()
            google_credential.put()
        g_credentials.authorize(http)
        api_root = 'https://gcdc2013-iogrow.appspot.com/_ah/api'
        api = 'crmengine'
        version = 'v1'
        discovery_url = '%s/discovery/v1/apis/%s/%s/rest' % (api_root, api, version)
        self.service = build(api, version, discoveryServiceUrl=discovery_url, http=http)

    def get_leads(self):
        # Fetch all greetings and print them out.
        leads = self.service.leads().listv2(body={}).execute()
        return leads


