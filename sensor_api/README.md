### Usage

1. Create and activate a [virtual environment](https://docs.python.org/3/library/venv.html).
2. Install [requirements](requirements.txt) (`pip install -r requirements.txt`).
3. Run [`sensor_api.py`](sensor_api.py).
4. (Optional) Use [ngrok](https://ngrok.com/download) to access locally-running Flask server from another host.

Note: this program should run on a Raspberry Pi, set up according to 
[these instructions](https://github.com/mattfredericksen/CSCE-3444-Group/wiki/Raspberry-Pi-Setup).

### Testing

1. Navigate to `sensor_api/` and run `python -m pytest`.
