from flask_restx import Api
from flask import Blueprint
from app.main.model.commit import Commit
from app.main.model.pull_request import PullRequest

from .main.controller.repository_controller import api as repository_ns
from .main.controller.coverage_controller import api as coverage_ns

blueprint = Blueprint('api', __name__)

api = Api(
    blueprint,
    title='Coverage Analysis API',
    version='1.0',
)

api.add_namespace(repository_ns, path='/repository')
api.add_namespace(coverage_ns, path='/coverage')
