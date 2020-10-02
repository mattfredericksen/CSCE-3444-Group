#	Returns current weather outside in kelvin
#	Access to 60 per minute, or 22 per minute if operating consistently

#	Celcius = kelvin - 273.15
#	Fahrenheit = (Celcius*9/5) + 32

import requests

def get_weather():
    zipcode = '75028'
    response = requests.get("http://api.openweathermap.org/data/2.5/weather?zip=" + zipcode + "&APPID=f2d40f5cd4f606abecf7872b7a9ebc72")
    
    print(response.json()['main']['temp'])

