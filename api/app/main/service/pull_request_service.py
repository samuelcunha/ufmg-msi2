
from app.main.service.codecov import Codecov
from app.main.model.pull_request import PullRequest
from typing import Dict, Tuple
from app.main.service.db import insert, insert_ignore_many


def insert_new_pull_request(data: Dict[str, str]) -> Tuple[Dict[str, str], int]:
    pr = PullRequest.query.filter_by(id=data['id']).first()
    if not pr:
        new_pr = PullRequest(
            id=data['id'],
            repository_id=data['repository_id'],
            coverage_base=data['coverage_base'],
            coverage_head=data['coverage_head'],
            timestamp=data['timestamp']
        )
        insert(new_pr)
        response_object = {
            'status': 'success',
            'message': 'Successfully created.'
        }
        return response_object, 201
    else:
        response_object = {
            'status': 'fail',
            'message': 'Pull request already exists.',
        }
        return response_object, 409


def get_by_repository(repo_id):
    return PullRequest.query.filter_by(repository_id=repo_id).all()



def get_coverage(codecov_info):
    return codecov_info.get('commit', {}).get('totals', {}).get('c', 0)


def find_pull_requests(repo):
    pull_requests = Codecov.get_pull_requests(repo, params={'state': 'merged', 'limit':'30'})
    data=[]
    for pull_request in pull_requests:
        if pull_request['base'] != None and pull_request['base']['totals']:
            coverage_base = pull_request['base']['totals']['c'] or 0
            if pull_request['head'] != None and pull_request['head']['totals']:
                coverage_head = pull_request['head']['totals']['c'] or 0
                if coverage_base and coverage_head:
                    data.append({
                        'id': pull_request['pullid'],
                        'repository_id': repo.id,
                        'coverage_base': coverage_base,
                        'coverage_head': coverage_head,
                        'timestamp': pull_request['updatestamp']
                    })
    insert_ignore_many(PullRequest, data)
    return True
