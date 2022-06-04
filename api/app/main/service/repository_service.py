from app.main.util.enum import RepositoryStatusEnum
from app.main.model.repository import Repository
from typing import Dict, Tuple
from app.main.service.db import save


def save_new_repository(data: Dict[str, str]) -> Tuple[Dict[str, str], int]:
    repository = Repository.query.filter_by(
        name=data['name'], owner=data['owner']).first()
    if not repository:
        new_repository = Repository(
            name=data['name'],
            owner=data['owner'],
            origin=data['origin']
        )
        save(new_repository)
        response_object = {
            'status': 'success',
            'message': 'Successfully created.'
        }
        return response_object, 201
    else:
        response_object = {
            'status': 'fail',
            'message': 'Repository already exists.',
        }
        return response_object, 409


def get_all_repositories():
    return Repository.query.all()


def get_a_repository(name):
    return Repository.query.filter_by(name=name).first()


def get_pending_repositories():
    return Repository.query.filter_by(status=RepositoryStatusEnum.PENDING).all()
