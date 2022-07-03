from functools import wraps

from flask import request

from typing import Callable

from app.main.service.auth_service import validate_token


def token_required(f) -> Callable:
    @wraps(f)
    def decorated(*args, **kwargs):

        authorized, data = validate_token(request)

        if not authorized:
            return data, 401

        return f(*args, **kwargs)

    return decorated
