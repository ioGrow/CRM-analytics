import os

__author__ = 'GHIBOUB Khalid'

if "SERVER_SOFTWARE" in os.environ:
  if os.environ['SERVER_SOFTWARE'].startswith('Dev'):
    from dev import config as custom_config
  elif os.environ['SERVER_SOFTWARE'].startswith('Google'):
    from prod import config as custom_config
  else:
    raise ValueError("Environment undetected")
else:
  from testing import config as custom_config

from default import config
config.update(custom_config)
