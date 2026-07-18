from flask import request
from app.main.util.decorator import token_required
from flask_restx import Resource

from ..util.dto import RepositoryDto
from ..service.repository_service import insert_new_repository, get_all_repositories, get_one_by_id, get_distinct_languages
from ..util.enum import RepositoryStatusEnum
from typing import Dict, Tuple

api = RepositoryDto.api

MAX_PAGE_SIZE = 100
VALID_STATUSES = {RepositoryStatusEnum.PENDING, RepositoryStatusEnum.SUCCESS, RepositoryStatusEnum.ERROR}
VALID_SORTS = {'coverage_asc', 'coverage_desc'}


@api.route('')
class RepositoryList(Resource):
    @api.doc(params={
        'page': 'Page number (default 1)',
        'page_size': 'Items per page, max 100 (default 20)',
        'search': 'Filter by owner or name (substring match)',
        'language': 'Filter by exact main_language',
        'owner': 'Filter by exact owner',
        'status': 'Filter by status (pending, success, error)',
        'sort': 'Sort order (coverage_asc, coverage_desc)'
    })
    @api.marshal_with(RepositoryDto.repository_paginated)
    def get(self):
        """List all repositories (paginated)"""
        page = request.args.get('page', 1, type=int)
        page_size = request.args.get('page_size', 20, type=int)
        search = request.args.get('search', None, type=str)
        language = request.args.get('language', None, type=str)
        owner = request.args.get('owner', None, type=str)
        status = request.args.get('status', None, type=str)
        sort = request.args.get('sort', None, type=str)
        page_size = min(max(page_size, 1), MAX_PAGE_SIZE)
        page = max(page, 1)
        status = status if status in VALID_STATUSES else None
        sort = sort if sort in VALID_SORTS else None

        pagination = get_all_repositories(
            page=page, page_size=page_size, search=search,
            language=language, owner=owner, status=status, sort=sort
        )
        return {
            'repositories': pagination.items,
            'total': pagination.total,
            'page': page,
            'page_size': page_size,
            'pages': pagination.pages
        }


@api.route('/languages')
class RepositoryLanguages(Resource):
    def get(self):
        """List distinct main languages across repositories"""
        return {'languages': get_distinct_languages()}

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
