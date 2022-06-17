from flask_restx import Namespace, fields

class RepositoryDto:
    api = Namespace('Repository ', description='Repository operations')
    repository_list = api.model('RepositoryList', {
        'name': fields.String(),
        'owner': fields.String(),
        'origin': fields.String(),
        'coverage': fields.Float(),
        'main_language': fields.String(),
        'license': fields.String(),
        'status': fields.String(),
        'status_info': fields.String(),
        'updated': fields.DateTime(),
        
    })
    repository_add = api.model('RepositoryAdd', {
        'name': fields.String(required=True),
        'owner': fields.String(required=True),
        'origin': fields.String(required=True, example='codecov')
    })
    
    
class CommitDto:
    api = Namespace('Commit')
    commit = api.model('commit', {
        'id': fields.String(required=True, description='commit id')
    })


class PullRequestDto:
    api = Namespace('Pull Request')
    pull_request = api.model('pull_request', {
        'id': fields.String(required=True, description='Pull request id')
    })


class CoverageDto:
    api = Namespace('Coverage', description='Coverage info')
    language_coverage = api.model('Repository', {
        'language': fields.String(),
        'coverage': fields.Float(),
        'count': fields.Integer
    })
    
    owner_coverage = api.model('Repository', {
        'owner': fields.String(),
        'coverage': fields.Float(),
        'count': fields.Integer
    })
    
    repository_coverage = api.model('Repository', {
        'repository': fields.Nested(RepositoryDto.repository_list),
        'language': fields.Nested(language_coverage),
        'owner': fields.Nested(owner_coverage)
    })
