### Usage

1. Download and extract [prometheus](https://prometheus.io/docs/introduction/first_steps/).
2. Use [`prometheus.yml`](prometheus.yml) as the config file by placing it in the same directory 
   as the prometheus executable, or by using the `--config` flag.
3. Prometheus will attempt to scrape metrics from the Flask app in 
   [`sensors_api.py`](../sensor_api/sensor_api.py), so [get that running](../sensor_api/README.md).
