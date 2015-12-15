import os
import sys
from google.appengine.ext.appstats import recording

__author__ = 'GHIBOUB Khalid'

appstats_CALC_RPC_COSTS = True

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'venv/lib/python2.7/site-packages'))


def webapp_add_wsgi_middleware(app):
  app = recording.appstats_wsgi_middleware(app)
  return app
