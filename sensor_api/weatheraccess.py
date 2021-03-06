# Returns current weather outside in celsius
# https://prometheus.io/docs/practices/naming/#base-units

# OpenWeather API access is limited to 60 per minute,
# or 22 per minute if operating consistently.

import requests


def get_weather(zipcode):
    url = 'http://api.openweathermap.org/data/2.5/weather'
    app_id = 'f2d40f5cd4f606abecf7872b7a9ebc72'

    try:
        response = requests.get(f'{url}?zip={zipcode}&APPID={app_id}')
        return round(response.json()['main']['temp'] - 273.15, 3)
    except Exception as e:
        print(e, "Error reading weather api response", sep='\n')
        return float('NaN')
