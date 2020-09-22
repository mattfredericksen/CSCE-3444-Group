"""
This module will discover available sensors
and wrap them in the Sensor class
"""


class Sensor:
    def __init__(self, name):
        self.name = name

    def read(self):
        raise NotImplementedError


class TemperatureSensor(Sensor):
    def read(self):
        # research in progress for connecting sensors RPi
        pass


class PressureSensor(Sensor):
    def read(self):
        # research in progress for connecting sensors RPi
        pass


# TODO: discover and process sensors here
sensors = []

# for now, mock sensors
from random import uniform

s = TemperatureSensor('incoming_air')
s.read = lambda: round(uniform(70, 80), 1)
sensors.append(s)

s = TemperatureSensor('outgoing_air')
s.read = lambda: round(uniform(60, 70), 1)
sensors.append(s)

s = PressureSensor('pressure')
s.read = lambda: round(uniform(.8, 1), 1)
sensors.append(s)
