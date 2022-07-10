from re import I

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

from .config import config_by_name
from flask.app import Flask
from flask_apscheduler import APScheduler
import os


class CustomSQLAlchemy(SQLAlchemy):
    def apply_driver_hacks(self, app, info, options):
        if "isolation_level" not in options:
            options["isolation_level"] = "READ COMMITTED"
            return super(CustomSQLAlchemy, self).apply_driver_hacks(app, info, options)

db = CustomSQLAlchemy()
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


