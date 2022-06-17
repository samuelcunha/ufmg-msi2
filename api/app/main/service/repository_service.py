
from app.main.util.enum import LicenseEnum
from app.main.service.db import update
from app.main.service.codecov import Codecov
from app.main.service.github import Github
from app.main.util.enum import RepositoryStatusEnum
from app.main.model.repository import Repository
from typing import Dict, Tuple
from app.main.service.db import insert

LIMIT = 50


def insert_new_repository(data: Dict[str, str]) -> Tuple[Dict[str, str], int]:
    repository = Repository.query.filter_by(
        name=data['name'], owner=data['owner']).first()
    if not repository:
        new_repository = Repository(
            name=data['name'],
            owner=data['owner'],
            origin=data['origin']
        )
        insert(new_repository)
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


def get_one_by_id(id):
    return Repository.query.filter_by(id=id).first()


def get_pending_repositories():
    return Repository.query.filter_by(status=RepositoryStatusEnum.PENDING).limit(LIMIT).all()


def get_outdated_repositories():
    return Repository.query.filter_by(status=RepositoryStatusEnum.PENDING).limit(LIMIT).all()


def find_repository_info(repo):
    codecov_info = Codecov.get_repository_info(repo)
    github_info = Github.get_repository_info(repo)
    return save_repository_info(repo, codecov_info, github_info)


def save_repository_info(repo, codecov_info, github_info):
    if not validate_active(repo, codecov_info):
        return False

    if not validate_coverage(repo, codecov_info):
        return False

    if not validate_language(repo, codecov_info, github_info):
        return False

    if not validate_license(repo, github_info):
        return False

    update(
        model=Repository,
        id=repo.id,
        data={
            'coverage': get_coverage(codecov_info),
            'main_language': codecov_info['repo']['language'] or github_info['main_language'],
            'license': github_info['license'],
            'status_info': ""
        }
    )
    return True


def validate_active(repo, codecov_info):
    if not codecov_info or not codecov_info.get('repo') or codecov_info['repo']['active'] is False:
        update(
            model=Repository,
            id=repo.id,
            data={
                'status': RepositoryStatusEnum.ERROR,
                'status_info': "Repositório não encontrado"
            }
        )
        return False
    return True


def validate_coverage(repo, codecov_info):
    if not codecov_info or get_coverage(codecov_info) == 0:
        update(
            model=Repository,
            id=repo.id,
            data={
                'status': RepositoryStatusEnum.ERROR,
                'status_info': "Repositório não possui dados de cobertura"
            }
        )
        return False
    return True


def validate_license(repo, github_info):
    if not github_info['license']:
        update(
            model=Repository,
            id=repo.id,
            data={
                'status': RepositoryStatusEnum.ERROR,
                'status_info': "Licença não encontrada"
            }
        )
        return False
    elif not github_info['license'] in LicenseEnum.OPEN_SOURCE:
        update(
            model=Repository,
            id=repo.id,
            data={
                'status': RepositoryStatusEnum.ERROR,
                'status_info': "Repositório não possui uma licença de código aberto"
            }
        )
        return False
    return True


def validate_language(repo, codecov_info, github_info):
    if not codecov_info.get('repo') or (not codecov_info['repo']['language'] and not github_info['main_language']):
        update(
            model=Repository,
            id=repo.id,
            data={
                'status': RepositoryStatusEnum.ERROR,
                'status_info': "Linguagem principal não encontrada"
            }
        )
        return False
    return True


def get_coverage(codecov_info):
    return codecov_info.get('commit', {}).get('totals', {}).get('c', 0)


def set_repository_processed(repo):

    update(
        model=Repository,
        id=repo.id,
        data={
            'status': RepositoryStatusEnum.SUCCESS
        }
    )
