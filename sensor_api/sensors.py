"""
This module will discover available sensors and make
them accessible through the `get_sensors()` function.
"""
from prometheus_client import Gauge
from weatheraccess import get_weather
from random import uniform, choice


class Sensor(Gauge):
    def __init__(self, name, *args, **kwargs):
        super().__init__(name, self.__class__.__name__, *args, **kwargs)

    def read(self):
        raise NotImplementedError

    def collect(self):
        # overriding this function allows sensors to refresh
        # immediately before yielding metrics to Prometheus
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


class StateSensor(Sensor):
    # Rather than recording a count of the times the system has cycled,
    # this sensor just checks the current on/off state.
    # Later, we can use this function for creating the count:
    # https://prometheus.io/docs/prometheus/latest/querying/functions/#changes

    def read(self):
        # research if progress for checking on/off state
        pass


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

    s = StateSensor('is_on')
    s.read = lambda: choice([True, False])
    sensor_list.append(s)

    return sensor_list
