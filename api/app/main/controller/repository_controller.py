from flask import request
from flask_restx import Resource

from ..util.dto import RepositoryDto
from ..service.repository_service import insert_new_repository, get_all_repositories, get_one_by_id
from typing import Dict, Tuple

api = RepositoryDto.api

@api.route('')
class RepositoryList(Resource):
    @api.marshal_with(RepositoryDto.repository_list, envelope='repositories')
    def get(self):
        """List all repositories"""
        return get_all_repositories()

    @api.expect(RepositoryDto.repository_add)
    @api.response(201, 'Repository successfully created.')
    def post(self) -> Tuple[Dict[str, str], int]:
        """Creates a new Repository """
        data = request.json
        return insert_new_repository(data=data)


@api.route('/<int:repo_id>')
@api.response(404, 'Repository not found.')
class Repository(Resource):
    @api.marshal_with(RepositoryDto.repository_list, envelope='repository')
    def get(self, repo_id):
        """Get a repository given its identifier"""
        repository = get_one_by_id(repo_id)
        if not repository:
            api.abort(404)
        else:
            return repository



