from flask_restx import Namespace, fields, cors

class RepositoryDto:
    api = Namespace('Repository ', description='Repository operations', decorators=[cors.crossdomain(origin="*")])
    repository_list = api.model('RepositoryList', {
        'id': fields.Integer(),
        'name': fields.String(),
        'owner': fields.String(),
        'origin': fields.String(),
        'coverage': fields.Float(),
        'main_language': fields.String(),
        'license': fields.String(),
        'status': fields.String(),
        'status_info': fields.String(),
        'updated': fields.DateTime()
        
    })
    repository_add = api.model('RepositoryAdd', {
        'name': fields.String(required=True),
        'owner': fields.String(required=True),
        'origin': fields.String(required=True, example='codecov')
    })
    
    
class CommitDto:
    api = Namespace('Commit', decorators=[cors.crossdomain(origin="*")])
    commit = api.model('commit', {
        'id': fields.String(required=True, description='commit id')
    })


class PullRequestDto:
    api = Namespace('Pull Request', decorators=[cors.crossdomain(origin="*")])
    pull_request = api.model('pull_request', {
        'id': fields.String(required=True, description='Pull request id'),
        'coverage_head': fields.Float(),
        'coverage_base': fields.Float(),
        'timestamp': fields.DateTime(),
    })


class CoverageDto:
    api = Namespace('Coverage', description='Coverage info', decorators=[cors.crossdomain(origin="*")])
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
        'pull_requests': fields.Nested(PullRequestDto.pull_request),
        'owner': fields.Nested(owner_coverage)
    })
