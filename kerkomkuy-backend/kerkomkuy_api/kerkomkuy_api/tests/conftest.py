import pytest
from webtest import TestApp
from pyramid.paster import get_app
import os

@pytest.fixture(scope="session")
def app():
    here = os.path.dirname(__file__)
    ini_path = os.path.abspath(os.path.join(here, "../../testing.ini"))
    app = get_app(ini_path, name="main")
    return TestApp(app)
