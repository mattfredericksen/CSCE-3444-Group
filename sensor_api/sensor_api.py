"""
This module launches a Flask app REST api
for retrieving temperature and pressure sensor data
"""

from werkzeug.middleware.dispatcher import DispatcherMiddleware
from prometheus_client.exposition import make_wsgi_app

from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS

from sensors import get_sensors

app = Flask(__name__)

# allow cross-origin resource sharing
CORS(app)

api = Api(app)

# TODO: consider switching from HTTP to HTTPS
#       and adding authentication

sensor_list = get_sensors()


class Sensors(Resource):
    @staticmethod
    def get():
        # TODO: consider making this response JSend compliant
        #       https://github.com/omniti-labs/jsend
        return [{
            'name': s._name,
            'value': s.read() if hasattr(s, 'read') else s.collect()[0].samples[0].value}
            for s in sensor_list]


api.add_resource(Sensors, '/')

# Add prometheus wsgi middleware to route /metrics requests
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

if __name__ == '__main__':
    # we will remove debug mode in final product
    app.run(debug=True, host='0.0.0.0')
