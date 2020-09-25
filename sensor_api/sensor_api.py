"""
This module launches a Flask app REST api
for retrieving temperature and pressure sensor data
"""


from flask import Flask
from flask_restful import Resource, Api

from sensors import sensor_list

app = Flask(__name__)
api = Api(app)

# TODO: consider switching from HTTP to HTTPS
#       and adding authentication


class Sensors(Resource):
    def get(self):
        # TODO: consider making this response JSend compliant
        #       https://github.com/omniti-labs/jsend
        return {s.name: s.read() for s in sensor_list}


api.add_resource(Sensors, '/')

if __name__ == '__main__':
    # we will remove debug mode in final product
    app.run(debug=True)
