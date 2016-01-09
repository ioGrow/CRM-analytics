__author__ = 'GHIBOUB Khalid'
# !/bin/python

time = raw_input().strip()
time_ = int(time[:2])
if time[-2:] == 'AM':
    if time_ == 12:
        print '00' + time[2:-2]
    else:
        print time[:-2]
else:
    if time_ == 12:
        print time[:-2]
    else:
        print str(int(time[:2]) + 12) + time[2:-2]
