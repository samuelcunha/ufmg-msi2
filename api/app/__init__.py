from flask_restx import Api
from flask import Blueprint

from .main.controller.repository_controller import api as repository_ns

blueprint = Blueprint('api', __name__)


api = Api(
    blueprint,
    title='Coverage Analysis API',
    version='1.0',
)

api.add_namespace(repository_ns, path='/repository')
