# Returns current weather outside in kelvin
# Access to 60 per minute, or 22 per minute if operating consistently

# Celcius = kelvin - 273.15
# Fahrenheit = (Celcius*9/5) + 32

import requests


def get_weather():
    url = 'http://api.openweathermap.org/data/2.5/weather'
    zipcode = '75028'
    app_id = 'f2d40f5cd4f606abecf7872b7a9ebc72'

    response = requests.get(f'{url}?zip={zipcode}&APPID={app_id}')

    # for now, respond with Fahrenheit
    degrees_k = response.json()['main']['temp']
    return round(((degrees_k - 273.15) * 9/5) + 32, 1)

