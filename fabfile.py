import socket
import urllib2

from fabric.api import local

from distutils import spawn

__author__ = 'GHIBOUB Khalid'
INTERNET_TEST_URL = 'https://www.google.com'

"""
    REQUIREMENTS:
        - install pip with distribute (http://packages.python.org/distribute/)
        - sudo pip install Fabric
"""


def is_internet_on():
    try:
        urllib2.urlopen(INTERNET_TEST_URL, timeout=2)
        return True
    except (urllib2.URLError, socket.timeout):
        return False


def check_virtualenv():
    return bool(spawn.find_executable('virtualenv')), 'virtualenv', '#virtualenv'


def check_bower():
    return bool(spawn.find_executable('bower')), 'bower', '#bower'


def check_gulp():
    return bool(spawn.find_executable('gulp')), 'gulp', '#gulp'


def install():
    if is_internet_on():
        if not check_virtualenv():
            local("pip install virtualenv")
        if not check_gulp():
            local("npm install -g gulp")
        if not check_bower():
            local("npm install -g bower")
        local("python run.py -d")
        local("npm install")
        local("bower install")
        local("gulp serve-gae")
    else:
        print 'ERROR ==> You have no internet connection.'


def update():
    local("python run.py -d")
    local("npm install")
    local("bower install")


def run():
    local("gulp serve-gae")
