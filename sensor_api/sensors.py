"""
This module will discover available sensors and make
them accessible through the `get_sensors()` function.
"""
from prometheus_client import Gauge, Enum
from weather_api.weatheraccess import get_weather
from random import uniform, choice


class Sensor(Gauge):
    def __init__(self, name, *args, **kwargs):
        super().__init__(name, self.__class__.__name__, *args, **kwargs)

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
    # TODO: stop using Enum since it creates a label for each state

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def read(self):
        # research if progress for checking on/off state
        pass

    def collect(self):
        self.state(self.read())
        return super().collect()


# TODO: discover and process sensors here
def get_sensors():
    """This function returns a list of objects which
    can be detected by Prometheus's metric scraping.
    It should only be called once to avoid duplicating
    metrics in the collector registry.
    """
    sensor_list = []

    # this gauge is fully functional
    s = Gauge('outside_air', 'Outside air temperature')
    s.set_function(lambda: get_weather('76201'))
    sensor_list.append(s)

    # for now, mock the remaining sensors with random data
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

    return sensor_list
