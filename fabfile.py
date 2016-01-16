from fabric.api import local

__author__ = 'GHIBOUB Khalid'

"""
    REQUIREMENTS:
        - install pip with distribute (http://packages.python.org/distribute/)
        - sudo pip install Fabric
"""


def start():
    local("python run.py -d")


def run():
    local("python run.py -s -o localhost -p 8070")
