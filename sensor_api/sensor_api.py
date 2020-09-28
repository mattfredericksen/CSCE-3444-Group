"""
This module launches a Flask app REST api
for retrieving temperature and pressure sensor data
"""

from werkzeug.middleware.dispatcher import DispatcherMiddleware
from prometheus_client.exposition import make_wsgi_app

from flask import Flask
from flask_restful import Resource, Api
from prometheus_client import Gauge

from sensors import sensor_list

app = Flask(__name__)
api = Api(app)

# Errors might happen here after a hot-reload in debug mode
#     ValueError: Duplicated timeseries in CollectorRegistry
gauges = []
for s in sensor_list:
    g = Gauge(s.name, f'{s.name} sensor')
    g.set_function(s.read)
    gauges.append(s)

# TODO: consider switching from HTTP to HTTPS
#       and adding authentication


class Sensors(Resource):
    def get(self):
        # TODO: consider making this response JSend compliant
        #       https://github.com/omniti-labs/jsend
        return {s.name: s.read() for s in sensor_list}


api.add_resource(Sensors, '/')

# Add prometheus wsgi middleware to route /metrics requests
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

if __name__ == '__main__':
    # we will remove debug mode in final product
    app.run(debug=True)
