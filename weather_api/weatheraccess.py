# Returns current weather outside in kelvin
# Access to 60 per minute, or 22 per minute if operating consistently

# Celcius = kelvin - 273.15
# Fahrenheit = (Celcius*9/5) + 32

import requests


def get_weather(zipcode, unit: str = 'F'):
    unit = unit.upper()
    if unit not in ('F', 'C', 'K'):
        raise ValueError(f'Invalid temperature unit: "{unit}"')

    url = 'http://api.openweathermap.org/data/2.5/weather'
    app_id = 'f2d40f5cd4f606abecf7872b7a9ebc72'

    response = requests.get(f'{url}?zip={zipcode}&APPID={app_id}')

    # for now, respond with Fahrenheit
    degrees = response.json()['main']['temp']
    if unit in ('C', 'F'):
        degrees -= 273.15
    if unit == 'F':
        degrees = degrees * 9/5 + 32
    return round(degrees, 1)
