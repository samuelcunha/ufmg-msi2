from flask_restx import Namespace, fields

class RepositoryDto:
    api = Namespace('repository', description='repository related operations')
    repository = api.model('repository', {
        'name': fields.String(required=True, description='repository name'),
        'owner': fields.String(required=True, description='repository owner'),
        'origin': fields.String(required=True, description='coverage info origin')
    })
