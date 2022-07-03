from flask_restx import Api
from flask import Blueprint, url_for
from app.main.model.commit import Commit
from app.main.model.pull_request import PullRequest

from .main.controller.repository_controller import api as repository_ns
from .main.controller.coverage_controller import api as coverage_ns

blueprint = Blueprint('api', __name__)
authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}

api = Api(
    blueprint,
    title='CoverIt API',
    version='1.0',
    doc='/v1',
    authorizations=authorizations,
    security='apikey'
)

api.add_namespace(repository_ns, path='/repository')
api.add_namespace(coverage_ns, path='/coverage')
