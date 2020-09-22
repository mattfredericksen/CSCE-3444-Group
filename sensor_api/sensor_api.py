from flask import Flask
from flask_restful import Resource, Api

from sensors import sensors

app = Flask(__name__)
api = Api(app)


class Sensors(Resource):
    def get(self):
        return {s.name: s.read() for s in sensors}


api.add_resource(Sensors, '/')

if __name__ == '__main__':
    # we will remove debug mode in final product
    app.run(debug=True)
