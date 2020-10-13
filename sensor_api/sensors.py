"""
This module will discover available sensors
and wrap them in the Sensor class
"""
from prometheus_client import Gauge, Enum
from weather_api.weatheraccess import get_weather
from random import uniform, choice


class Sensor(Gauge):
    def __init__(self, name):
        super().__init__(name, self.__class__.__name__)

    def read(self):
        raise NotImplementedError

    def collect(self):
        self.set(self.read())
        return super().collect()


class TemperatureSensor(Sensor):
    def read(self):
        # research in progress for connecting sensors to RPi
        pass


class PressureSensor(Sensor):
    def read(self):
        # research in progress for connecting sensors to RPi
        pass


class StateSensor(Enum):
    # Rather than recording a count of the times the system has cycled,
    # this sensor just checks the current on/off state.
    # Later, we can use this function for creating the count:
    # https://prometheus.io/docs/prometheus/latest/querying/functions/#changes

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def read(self):
        # research if progress for checking on/off state
        pass

    def collect(self):
        self.state(self.read())
        return super().collect()


# TODO: discover and process sensors here
sensor_list = []

s = Gauge('outside_air', 'Outside air temperature')
s.set_function(get_weather)
sensor_list.append(s)


# for now, mock sensors
s = TemperatureSensor('incoming_air')
s.read = lambda: round(uniform(70, 80), 1)
sensor_list.append(s)

s = TemperatureSensor('outgoing_air')
s.read = lambda: round(uniform(60, 70), 1)
sensor_list.append(s)

s = PressureSensor('pressure')
s.read = lambda: round(uniform(.8, 1), 2)
sensor_list.append(s)

s = StateSensor('state', 'Whether the HVAC is on or off', states=['on', 'off'])
s.read = lambda: choice(['on', 'off'])
sensor_list.append(s)
