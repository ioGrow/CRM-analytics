from fabric.api import local

__author__ = 'GHIBOUB Khalid'

"""
    REQUIREMENTS:
        - install pip with distribute (http://packages.python.org/distribute/)
        - sudo pip install Fabric
"""


def install():
    local("python run.py -d")
    local("npm install")
    local("bower install")
    local("gulp serve-gae")


def run():
    local("gulp serve-gae")
