
from app.main.util.enum import LicenseEnum
from app.main.service.db import update
from app.main.api.codecov import Codecov
from app.main.api.github import Github
from app.main.util.enum import RepositoryStatusEnum
from app.main.model.repository import Repository
from typing import Dict, Tuple
from app.main.service.db import insert
from app.main import db
from datetime import datetime, date
from sqlalchemy import func
import os

LIMIT = os.getenv('COVERIT_API_SYNC_ITEMS_PER_RUN', 50)


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


def get_all_repositories(page=1, page_size=20, search=None, language=None, owner=None, status=None, sort=None):
    query = Repository.query
    if search:
        term = '%' + search + '%'
        query = query.filter(
            db.or_(Repository.name.ilike(term), Repository.owner.ilike(term))
        )
    if language:
        query = query.filter(Repository.main_language == language)
    if owner:
        query = query.filter(Repository.owner == owner)
    if status:
        query = query.filter(Repository.status == status)

    if sort == 'coverage_asc':
        query = query.order_by(Repository.coverage.asc())
    elif sort == 'coverage_desc':
        query = query.order_by(Repository.coverage.desc())
    else:
        query = query.order_by(Repository.id)

    return query.paginate(page=page, per_page=page_size, error_out=False)


def get_distinct_languages():
    rows = db.session.query(Repository.main_language
                             ).filter(Repository.main_language.isnot(None)
                                      ).distinct(
                                      ).order_by(Repository.main_language
                                                 ).all()
    return [row[0] for row in rows]


def get_one_by_id(id):
    return Repository.query.filter_by(id=id).first()


def get_pending_repositories():
    return Repository.query.filter_by(status=RepositoryStatusEnum.PENDING).limit(LIMIT).all()


def set_repositories_to_update():
    today = date.today()
    Repository.query.filter(func.date(Repository.updated) < today, Repository.status == RepositoryStatusEnum.SUCCESS).update(
        {'status': RepositoryStatusEnum.PENDING}, synchronize_session='fetch')
    db.session.commit()


def find_repository_info(repo):
    try:
        codecov_info = Codecov.get_repository_info(repo)
        github_info = Github.get_repository_info(repo)
        return save_repository_info(repo, codecov_info, github_info)
    except Exception as error:
        print(error)
        set_repository_with_error(repo, str(error))
        return None


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
            'main_language': codecov_info['language'] or github_info['main_language'],
            'license': github_info['license'],
            'status_info': ""
        }
    )
    return True


def validate_active(repo, codecov_info):
    if not codecov_info or codecov_info.get('active') is False:
        set_repository_with_error(repo, "Repositório não encontrado")
        return False
    return True


def validate_coverage(repo, codecov_info):
    if not codecov_info or get_coverage(codecov_info) == 0:
        set_repository_with_error(
            repo, "Repositório não possui dados de cobertura")
        return False
    return True


def validate_license(repo, github_info):
    if not github_info['license']:
        set_repository_with_error(repo, "Licença não encontrada")
        return False
    elif not github_info['license'] in LicenseEnum.OPEN_SOURCE:
        set_repository_with_error(
            repo, "Repositório não possui uma licença de código aberto")
        return False
    return True


def validate_language(repo, codecov_info, github_info):
    if not codecov_info.get('language') and not github_info['main_language']:
        set_repository_with_error(repo, "Linguagem principal não encontrada")
        return False
    return True


def get_coverage(codecov_info):
    return (codecov_info.get('totals') or {}).get('coverage', 0) or 0


def set_repository_processed(repo):
    update(
        model=Repository,
        id=repo.id,
        data={
            'status': RepositoryStatusEnum.SUCCESS,
            'status_info': '',
            'updated': datetime.now()
        }
    )


def set_repository_with_error(repo, error):
    update(
        model=Repository,
        id=repo.id,
        data={
            'status': RepositoryStatusEnum.ERROR,
            'status_info': error,
            'updated': datetime.now()
        }
    )
