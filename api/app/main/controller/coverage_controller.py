from app.main.service.repository_service import get_one_by_id
from app.main.util.dto import CoverageDto
from app.main.service.coverage_service import get_one_by_language, get_all_by_language, get_all_by_owner, get_one_by_owner
from flask_restx import Resource

api = CoverageDto.api

@api.route('/language')
class CoverageByLanguage(Resource):
    @api.marshal_with(CoverageDto.language_coverage)
    def get(self):
        """Get average coverage for each language"""
        languages = get_all_by_language()
        return languages


@api.route('/language/<language>')
class CoverageByLanguageName(Resource):
    @api.response(404, 'Language not found.')
    @api.marshal_with(CoverageDto.language_coverage)
    def get(self, language):
        """Get average coverage for one language"""
        language = get_one_by_language(language)
        if not language:
            api.abort(404)
        else:
            return language


@api.route('/owner')
class CoverageByOwner(Resource):
    @api.response(404, 'Owner not found.')
    @api.marshal_with(CoverageDto.owner_coverage)
    def get(self):
        """Get average coverage for each owner"""
        by_owner = get_all_by_owner()
        return by_owner


@api.route('/owner/<owner>')
class CoverageByOwnerName(Resource):
    @api.marshal_with(CoverageDto.owner_coverage)
    def get(self, owner):
        """Get average coverage for one owner"""
        owner = get_one_by_owner(owner)
        if not owner:
            api.abort(404)
        else:
            return owner
        
@api.route('/repository/<int:id>')
class CoverageInfoRepository(Resource):
    @api.marshal_with(CoverageDto.repository_coverage)
    def get(self, id):
        """Get coverage info for one repository"""
        repository = get_one_by_id(id)
        if not repository:
            api.abort(404)
        owner = get_one_by_owner(repository.owner)
        language = get_one_by_language(repository.main_language)
        
        return {
            'repository': repository,
            'owner': owner,
            'language': language
        }
