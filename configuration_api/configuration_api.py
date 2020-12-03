"""
This module launches a Flask app REST api for receiving
and processing POST requests to configure user settings
for the HVAC Monitoring & Reporting System.

The app must be hosted on the same server as the AlertManager.
If launched from the alertmanager-* directory, no arguments
are required. If launched elsewhere, paths to the
configuration and template files should be specified.
"""

from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import requests

from jinja2 import Template
import yaml

import argparse
from glob import glob
import os

app = Flask(__name__)

# allow cross-origin resource sharing
CORS(app)

api = Api(app)

req_parser = reqparse.RequestParser()
req_parser.add_argument('email')


# TODO: switch to HTTPS and add authentication
class Configuration(Resource):
    @staticmethod
    def get():
        """Returns the currently configured email address."""
        try:
            with open(args.config, 'r') as file:
                config = yaml.safe_load(file)
            return {'email': config['receivers'][0]['email_configs'][0]['to']}
        except Exception as e:
            print(f"{e!r}\nUnable to parse file: \"{args.config}\"")

    @staticmethod
    def put():
        """Sets the receiver email for AlertManager."""
        req_args = req_parser.parse_args()
        with open(args.template, 'r') as file:
            config = Template(file.read()).render(email=req_args['email'])
        with open(args.config, 'r+') as file:
            old_config = file.read()
            file.seek(0)
            file.write(config)
            file.truncate()

        try:
            # address at which the AlertManager is running
            r = requests.post("http://localhost:9093/-/reload/")
            if r.status_code != 200:
                # restore the previous configuration
                with open(args.config, 'w') as file:
                    file.write(old_config)
                return {'error': "Unable to reload AlertManager configuration",
                        'responseContent': r.content}, r.status_code
            return {'email': req_args['email']}
        except Exception as e:
            # restore the previous configuration
            with open(args.config, 'w') as file:
                file.write(old_config)
            print(e)
            return {'error': "Unable to communicate with AlertManager",
                    'errorType': str(type(e))}, 500


api.add_resource(Configuration, '/email/')


def extant_file(path):
    files = glob(path)
    if len(files) == 0:
        raise argparse.ArgumentTypeError(f"file \"{path}\" does not exist")
    elif len(files) > 1:
        raise argparse.ArgumentTypeError(f"multiple files match \"{path}\"")
    elif not os.path.isfile(files[0]):
        raise argparse.ArgumentTypeError(f"\"{files[0]}\" is not a file")
    else:
        return files[0]


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--config", type=extant_file,
                        default="alertmanager.yml",
                        help="path to AlertManager configuration file")
    parser.add_argument("-t", "--template", type=extant_file,
                        default="alertmanager.yml.template",
                        help="path to AlertManager configuration file template")
    args = parser.parse_args()

    # we will remove debug mode in final product
    app.run(debug=True, host='0.0.0.0')
