### Usage

1. Download and extract [Prometheus](https://prometheus.io/docs/introduction/first_steps/).
2. Copy [`prometheus.yml`](prometheus.yml) and [`hvac_rules.yml`](hvac_rules.yml) into
   the extracted directory `prometheus-*/`.
3. Download and extract [AlertManager](https://prometheus.io/download/#alertmanager).
4. Copy [`alertmanager.yml`](alertmanager.yml) into the extracted directory `alertmanager-*/`.
5. Launch `prometheus` and `alertmanager`. On Linux systems, the 
   [`screen`](https://www.gnu.org/software/screen/manual/screen.html) utility is useful for 
   running and managing background tasks.
  
Prometheus will attempt to scrape metrics from the Flask app in 
[`sensors_api.py`](../sensor_api/sensor_api.py), so [get that running](../sensor_api).
