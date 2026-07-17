from flask import request
from app.main.util.decorator import token_required
from flask_restx import Resource

from ..util.dto import RepositoryDto
from ..service.repository_service import insert_new_repository, get_all_repositories, get_one_by_id
from typing import Dict, Tuple

api = RepositoryDto.api

MAX_PAGE_SIZE = 100


@api.route('')
class RepositoryList(Resource):
    @api.doc(params={
        'page': 'Page number (default 1)',
        'page_size': 'Items per page, max 100 (default 20)',
        'search': 'Filter by owner or name (substring match)'
    })
    @api.marshal_with(RepositoryDto.repository_paginated)
    def get(self):
        """List all repositories (paginated)"""
        page = request.args.get('page', 1, type=int)
        page_size = request.args.get('page_size', 20, type=int)
        search = request.args.get('search', None, type=str)
        page_size = min(max(page_size, 1), MAX_PAGE_SIZE)
        page = max(page, 1)

        pagination = get_all_repositories(page=page, page_size=page_size, search=search)
        return {
            'repositories': pagination.items,
            'total': pagination.total,
            'page': page,
            'page_size': page_size,
            'pages': pagination.pages
        }

    @api.expect(RepositoryDto.repository_add)
    @token_required
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
