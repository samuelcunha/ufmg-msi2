import os

def validate_token(request):
    auth_token = request.headers.get('Authorization')
    if auth_token:
        if auth_token == os.getenv('COVERIT_API_TOKEN'):
            return True, {'status': 'success'}

        response_object = {
            'status': 'fail',
            'message': 'Unauthorized'
        }
        return False, response_object
    else:
        response_object = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        return False, response_object
