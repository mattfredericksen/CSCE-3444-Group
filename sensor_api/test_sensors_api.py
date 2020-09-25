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


def test_sensor_count_is_3(response):
    data = json.loads(response.data)
    assert len(data) == 3


def test_all_sensors_reading(response):
    data = json.loads(response.data)
    assert all(data.values())
