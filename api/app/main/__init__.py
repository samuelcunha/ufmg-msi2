from re import I

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

from .config import config_by_name
from flask.app import Flask
from flask_apscheduler import APScheduler
import os


db = SQLAlchemy()
flask_bcrypt = Bcrypt()

scheduler = APScheduler()


def create_app(config_name: str) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    app.url_map.strict_slashes = False
    
    db.init_app(app)
    flask_bcrypt.init_app(app)

    start_scheduler(app)

    return app


def start_scheduler(app):
    if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        scheduler.init_app(app)
        scheduler.start()


