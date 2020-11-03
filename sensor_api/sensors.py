"""
This module will discover available sensors and make
them accessible through the `get_sensors()` function.
"""
from prometheus_client import Gauge
from weatheraccess import get_weather

import board
import busio
from adafruit_mcp9808 import MCP9808
from adafruit_ads1x15.ads1115 import ADS1115, P0
from adafruit_ads1x15.analog_in import AnalogIn


i2c = busio.I2C(board.SCL, board.SDA)


class Sensor(Gauge):
    def __init__(self, name, *args, **kwargs):
        super().__init__(name, self.__class__.__name__, *args, **kwargs)

    def read(self):
        raise NotImplementedError

    def collect(self):
        # this override allows sensors to refresh
        # immediately before yielding metrics to Prometheus
        self.set(self.read())
        return super().collect()


class TemperatureSensor(Sensor):
    def __init__(self, addr, name, *args, **kwargs):
        super().__init__(name, *args, **kwargs)
        self.device = MCP9808(i2c, address=addr)

    def read(self):
        # currently reads Celsius
        return self.device.temperature


class PressureSensor(Sensor):
    def __init__(self, addr, name, *args, **kwargs):
        super().__init__(name, *args, **kwargs)
        self.device = AnalogIn(ADS1115(i2c, address=addr), P0)

    def read(self):
        return self.device.value


class StateSensor(Sensor):
    def __init__(self, addr, name, *args, **kwargs):
        super().__init__(name, *args, **kwargs)
        self.device = AnalogIn(ADS1115(i2c, address=addr), P0)

    def read(self):
        # When system is running, voltage should be ~3.
        # When system is not running, noise may cause
        # voltage to rise above 0, but not more than 1
        return False if self.device.voltage < 1 else True


# Must be defined after class definitions.
# Empty dicts in case kwargs need to be added in the future.
device_addr_map = {
    0x18: (TemperatureSensor, ('incoming_air',), {}),
    0x19: (TemperatureSensor, ('outgoing_air',), {}),
    0x48: (PressureSensor, ('air_pressure',), {}),
    0x49: (StateSensor, ('is_on',), {}),
}


def get_sensors():
    """This function returns a list of objects which
    can be detected by Prometheus's metric scraping.
    It should only be called once to avoid duplicating
    metrics in the collector registry.
    """

    addresses = i2c.scan()
    if len(addresses) != len(device_addr_map):
        print(f'Expected addresses: {list(device_addr_map.keys())}')
        print(f'Discovered addresses: {addresses}')

    sensor_list = []
    for addr in i2c.scan():
        if addr in device_addr_map:
            cls, args, kwargs = device_addr_map[addr]
            sensor_list.append(cls(addr, *args, **kwargs))

    s = Gauge('outside_air', 'Weather API temperature')
    s.set_function(lambda: get_weather('76201'))
    sensor_list.append(s)

    return sensor_list
