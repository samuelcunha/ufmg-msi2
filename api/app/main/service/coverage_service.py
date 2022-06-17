
from sre_constants import SUCCESS
from app.main.service.db import update
from app.main.service.codecov import Codecov
from app.main.service.github import Github
from app.main.util.enum import RepositoryStatusEnum
from app.main.model.repository import Repository
from sqlalchemy import func, desc

from app.main import db


def get_all_by_language():
    language_coverage = db.session.query(
        Repository.main_language.label('language'),
        func.avg(Repository.coverage).label('coverage'),
        func.count(Repository.main_language).label('count')
    ).filter(
        Repository.status == RepositoryStatusEnum.SUCCESS
    ).group_by(Repository.main_language
               ).having(func.count(Repository.main_language) > 1
                        ).order_by(desc(func.avg(Repository.coverage))
                                   ).all()
    return language_coverage


def get_one_by_language(language_name):
    language_coverage = db.session.query(
        Repository.main_language.label('language'),
        func.avg(Repository.coverage).label('coverage'),
        func.count(Repository.main_language).label('count')
    ).filter(
        Repository.status == RepositoryStatusEnum.SUCCESS,
        Repository.main_language == language_name
    ).group_by(Repository.main_language
               ).first()
    return language_coverage


def get_all_by_owner():
    owner_coverage = db.session.query(
        Repository.owner.label('owner'),
        func.avg(Repository.coverage).label('coverage'),
        func.count(Repository.owner).label('count')
    ).filter(
        Repository.status == RepositoryStatusEnum.SUCCESS
    ).group_by(Repository.owner
               ).order_by(desc(func.avg(Repository.coverage))
                          ).all()
    return owner_coverage


def get_one_by_owner(owner_name):
    owner_coverage = db.session.query(
        Repository.owner.label('owner'),
        func.avg(Repository.coverage).label('coverage'),
        func.count(Repository.owner).label('count')
    ).filter(
        Repository.status == RepositoryStatusEnum.SUCCESS,
        Repository.owner == owner_name
    ).group_by(Repository.owner
               ).first()
    return owner_coverage
