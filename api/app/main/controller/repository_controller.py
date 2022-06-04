from flask import request
from flask_restx import Resource

from ..util.dto import RepositoryDto
from ..service.repository_service import save_new_repository, get_all_repositories, get_a_repository
from typing import Dict, Tuple

api = RepositoryDto.api
_repository = RepositoryDto.repository


@api.route('/')
class RepositoryList(Resource):
    @api.doc('list_of_registered_repositories')
    @api.marshal_list_with(_repository, envelope='data')
    def get(self):
        """List all registered repositories"""
        return get_all_repositories()

    @api.expect(_repository, validate=True)
    @api.response(201, 'Repository successfully created.')
    @api.doc('create a new repository')
    def post(self) -> Tuple[Dict[str, str], int]:
        """Creates a new Repository """
        data = request.json
        return save_new_repository(data=data)


@api.route('/<public_id>')
@api.param('public_id', 'The Repository identifier')
@api.response(404, 'Repository not found.')
class Repository(Resource):
    @api.doc('get a repository')
    @api.marshal_with(_repository)
    def get(self, public_id):
        """get a repository given its identifier"""
        repository = get_a_repository(public_id)
        if not repository:
            api.abort(404)
        else:
            return repository



