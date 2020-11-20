"""
This module will discover available sensors and make
them accessible through the `get_sensors()` function.
"""
from prometheus_client import Gauge, REGISTRY
from weatheraccess import get_weather

import board
import busio
from adafruit_mcp9808 import MCP9808
from adafruit_ads1x15.ads1115 import ADS1115, P0
from adafruit_ads1x15.analog_in import AnalogIn
from adafruit_bme280 import Adafruit_BME280_I2C as BME280


# Lower frequency means longer wires can be used
# with the i2c bus. Default value is 400k.
i2c = busio.I2C(board.SCL, board.SDA, frequency=1000)


class Sensor(Gauge):
    def __init__(self, name, *args, **kwargs):
        super().__init__(name, self.__class__.__name__, *args, **kwargs)

    def read(self):
        raise NotImplementedError

    def collect(self):
        # this override allows sensors to refresh
        # immediately before yielding metrics to Prometheus
        try:
            self.set(self.read())
        except Exception as e:
            print(e, f'Error reading sensor: {self._name}', sep='\n')
            self.set(float('NaN'))

        return super().collect()


class TemperatureSensor(Sensor):
    def __init__(self, addr, name, *args, **kwargs):
        super().__init__(name, *args, **kwargs)
        self.device = MCP9808(i2c, address=addr)

    def read(self):
        # MCP9808 chip returns temperature in celsius
        return self.device.temperature


class PressureSensor(Sensor):
    def __init__(self, addr, name, *args, **kwargs):
        super().__init__(name, *args, **kwargs)
        self.device = BME280(i2c, address=addr)

    def read(self):
        # BME280 chip returns pressure in kPa
        return self.device.pressure


class StateSensor(Sensor):
    def __init__(self, addr, name, *args, **kwargs):
        super().__init__(name, *args, **kwargs)
        self.device = AnalogIn(ADS1115(i2c, address=addr), P0)

    def read(self):
        # When system is running, voltage should be < 1.
        return True if self.device.voltage < 1 else False


# TODO: fix floating I2C address bug

# Must be defined after class definitions.
# Empty dicts in case kwargs need to be added in the future.
device_addr_map = {
    0x18: (TemperatureSensor, ('incoming_air',), {}),
    0x19: (TemperatureSensor, ('outgoing_air',), {}),
    # temporary 0x1b due to i2c address floating
    0x1b: (TemperatureSensor, ('outgoing_air',), {}),
    # temporary 0x1f due to i2c address floating
    0x1f: (TemperatureSensor, ('outgoing_air',), {}),
    0x48: (StateSensor, ('is_on',), {}),
    0x76: (PressureSensor, ('air_pressure',), {})
}


def get_sensors():
    """This function returns a list of objects which
    can be detected by Prometheus's metric scraping.
    If called a second time, objects from the previous
    call will become invalid.
    """

    # Remove default metrics and metrics created
    # previously by this function.
    for c in set(REGISTRY._names_to_collectors.values()):
        REGISTRY.unregister(c)

    # get a list of occupied i2c addresses
    addresses = i2c.scan()

    # compare discovered devices to expected devices
    if set(addresses) != set(device_addr_map.keys()):
        print(f'Unexpected I2C addresses: {set(addresses) - set(device_addr_map.keys())}')
        print(f'Missing I2C addresses: {set(device_addr_map.keys()) - set(addresses)}')

    # create prometheus metrics
    sensor_list = []
    for addr in addresses:
        if addr in device_addr_map:
            cls, args, kwargs = device_addr_map[addr]
            sensor_list.append(cls(addr, *args, **kwargs))

    # create
    s = Gauge('outside_air', 'Weather API temperature')
    s.set_function(lambda: get_weather('75077'))
    sensor_list.append(s)

    return sensor_list
