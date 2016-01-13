__author__ = 'GHIBOUB Khalid'
''' people export'''

import csv
import hashlib
import time
import urllib  # for url encoding

try:
    import json
except ImportError:
    import simplejson as json


class Mixpanel(object):
    def __init__(self, api_key, api_secret):
        self.api_key = api_key
        self.api_secret = api_secret

    def request(self, params, format='json'):
        '''let's craft the http request'''
        params['api_key'] = self.api_key
        params['expire'] = int(time.time()) + 600  # 600 is ten minutes from now
        if 'sig' in params: del params['sig']
        params['sig'] = self.hash_args(params)

        request_url = 'http://export.mixpanel.com/api/2.0/export/?' + self.unicode_urlencode(params)

        request = urllib.urlopen(request_url)
        data = request.read()

        # print request_url

        return data

    def hash_args(self, args, secret=None):
        '''Hash dem arguments in the proper way
        join keys - values and append a secret -> md5 it'''

        for a in args:
            if isinstance(args[a], list): args[a] = json.dumps(args[a])

        args_joined = ''
        for a in sorted(args.keys()):
            if isinstance(a, unicode):
                args_joined += a.encode('utf-8')
            else:
                args_joined += str(a)

            args_joined += "="

            if isinstance(args[a], unicode):
                args_joined += args[a].encode('utf-8')
            else:
                args_joined += str(args[a])

        hash = hashlib.md5(args_joined)

        if secret:
            hash.update(secret)
        elif self.api_secret:
            hash.update(self.api_secret)
        return hash.hexdigest()

    def unicode_urlencode(self, params):
        ''' Convert stuff to json format and correctly handle unicode url parameters'''

        if isinstance(params, dict):
            params = params.items()
        for i, param in enumerate(params):
            if isinstance(param[1], list):
                params[i] = (param[0], json.dumps(param[1]),)

        result = urllib.urlencode([(k, isinstance(v, unicode) and v.encode('utf-8') or v) for k, v in params])
        return result

    def export_csv(self, outfilename, fname):
        """
        takes the json and returns a csv file
        """
        subkeys = set()
        with open(fname, 'rb') as r:
            with open(outfilename, 'wb') as w:
                # Get all properties (will use this to create the header)
                for line in r:
                    try:
                        subkeys.update(set(json.loads(line)['$properties'].keys()))
                    except:
                        pass

                # Create the header
                header = ['$distinct_id']
                for key in subkeys:
                    header.append(key)

                # Create the writer and write the header
                writer = csv.writer(w)
                writer.writerow(header)

                # Return to the top of the file, then write the events out, one per row
                r.seek(0, 0)
                for line in r:
                    entry = json.loads(line)
                    row = []
                    try:
                        row.append(entry['$distinct_id'])
                    except:
                        row.append('')

                    for subkey in subkeys:
                        try:
                            row.append((entry['$properties'][subkey]).encode('utf-8'))
                        except AttributeError:
                            row.append(entry['$properties'][subkey])
                        except KeyError:
                            row.append("")
                    writer.writerow(row)


if __name__ == '__main__':
    api = Mixpanel(
        api_key='dfcebb832b4a5874293a390a2abae928',
        api_secret='6c9799e849a336b121e785e2321dca11',
    )

    '''Here is the place to define your selector to target only the users that you're after'''
    '''parameters = {'selector':'(properties["$email"] == "Albany") or (properties["$city"] == "Alexandria")'}'''
    parameters = {'selector': ''}
    response = api.request(parameters)

    parameters['session_id'] = json.loads(response)['session_id']
    parameters['page'] = 0
    global_total = json.loads(response)['total']

    print "Session id is %s \n" % parameters['session_id']
    print "Here are the # of people %d" % global_total
    fname = "people.txt"
    has_results = True
    total = 0
    with open(fname, 'w') as f:
        while has_results:
            responser = json.loads(response)['results']
            total += len(responser)
            has_results = len(responser) == 1000
            for data in responser:
                f.write(json.dumps(data) + '\n')
            print "%d / %d" % (total, global_total)
            parameters['page'] += 1
            if has_results:
                response = api.request(parameters)
    print response

    '''specify your output filename here'''
    api.export_csv("people_export_" + str(int(time.time())) + ".csv", fname)
