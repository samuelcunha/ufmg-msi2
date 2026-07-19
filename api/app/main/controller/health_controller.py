from flask_restx import Resource

from ..service.health_service import get_health
from ..util.dto import HealthDto

api = HealthDto.api


@api.route('')
class Health(Resource):
    @api.doc(security=None)
    @api.marshal_with(HealthDto.health)
    def get(self):
        """Report API, database and scheduler health"""
        response, healthy = get_health()
        return response, 200 if healthy else 503
