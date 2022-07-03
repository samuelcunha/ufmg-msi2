
from pprint import pprint
from app.main.service.codecov import Codecov
from app.main.model.commit import Commit
from app.main.service.db import insert_ignore_many
import datetime
import datetime
from dateutil.relativedelta import relativedelta
from dateutil import parser
from sqlalchemy import desc


def get_by_repository(repo_id):
    return Commit.query.filter_by(repository_id=repo_id).all()


def get_coverage(commit):
    try:
        coverage = 0
        if commit and commit.get('totals', None) and commit.get('totals').get('c'):
            coverage = commit['totals']['c']
        return coverage
    except:
        print(commit)


def find_intervals(date):
    all_intervals = generate_intervals()
    intervals = []
    for all_interval in all_intervals:
        current_interval = parser.parse(all_interval['to'])
        if current_interval >= date:
            intervals = [all_interval]
    return intervals


def generate_intervals():
    start_date = datetime.datetime(2020, 1, 1)
    end_date = datetime.datetime.today()
    quarter = 1
    intervals = []
    while (start_date < end_date):
        quarter = quarter if quarter < 4 else 1
        interval = {
            'interval': str(start_date.year) + '/' + str(quarter),
            'from': start_date.strftime("%Y-%m-%d 00:00:01"),
            'limit': 5
        }
        start_date = start_date + relativedelta(months=4)
        interval['to'] = start_date.strftime("%Y-%m-%d 00:00:00")
        intervals.append(interval)
        quarter += 1

    return intervals


def find_commits(repo):
    last_commit = Commit.query.filter_by(
        repository_id=repo.id).order_by(desc(Commit.timestamp)).first()
    if last_commit:
        intervals = find_intervals(last_commit.timestamp)
    else:
        intervals = generate_intervals()

    for interval in intervals:
        commits = Codecov.get_commits(repo, interval)
        data = []
        for commit in commits:
            coverage = get_coverage(commit)
            if coverage:
                data.append({
                    'id': commit['commitid'],
                    'repository_id': repo.id,
                    'coverage': coverage,
                    'branch': commit['branch'],
                    'interval': interval['interval'],
                    'timestamp': commit['timestamp']
                })
        try:
            insert_ignore_many(Commit, data)
        except Exception as error:
            print(error)
    return True
