
from app.main.api.codecov import Codecov
from app.main.model.commit import Commit
from app.main.service.db import insert_ignore_many
from app.main import db
from dateutil import parser
import os

LIMIT = int(os.getenv('COVERIT_API_SYNC_ITEMS_PER_RUN', 50))


def get_by_repository(repo_id):
    return Commit.query.filter_by(repository_id=repo_id).all()


def get_coverage(commit):
    try:
        coverage = 0
        if commit and commit.get('totals', None) and commit.get('totals').get('coverage'):
            coverage = commit['totals']['coverage']
        return coverage
    except:
        print(commit)


def get_interval(timestamp):
    date = parser.parse(timestamp)
    quarter = (date.month - 1) // 4 + 1
    return str(date.year) + '/' + str(quarter)


def find_commits(repo):
    commits = Codecov.get_commits(repo, {'page_size': LIMIT})
    data = []
    for commit in commits:
        coverage = get_coverage(commit)
        if coverage:
            data.append({
                'id': commit['commitid'],
                'repository_id': repo.id,
                'coverage': coverage,
                'branch': commit['branch'],
                'interval': get_interval(commit['timestamp']),
                'timestamp': commit['timestamp']
            })
    try:
        insert_ignore_many(Commit, data)
    except Exception as error:
        db.session.rollback()
        print(error)
    return True
