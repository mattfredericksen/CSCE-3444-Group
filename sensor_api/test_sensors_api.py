import pytest
import sensor_api
import json


@pytest.fixture
def response():
    sensor_api.app.config['TESTING'] = True
    with sensor_api.app.test_client() as client:
        yield client.get('/')


def test_response_is_200(response):
    assert response.status_code == 200


def test_content_is_json(response):
    assert response.content_type == 'application/json'


def test_sensor_count(response):
    data = json.loads(response.data)
    assert len(data) == len(sensor_api.sensor_list)


def test_all_sensors_reading(response):
    data = json.loads(response.data)
    for sensor in data:
        for sample in sensor:
            assert sample['value'] is not None, f'with sensor "{sample["""name"""]}"'
