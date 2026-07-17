import requests
import os

BASE_URL = 'https://api.codecov.io/api/v2'
SERVICE = 'github'


class Codecov:
    def headers():
        token = os.getenv('CODECOV_API_TOKEN')
        return {'Authorization': 'bearer ' + token} if token else {}

    def get(url, params={}):
        response = requests.get(url, headers=Codecov.headers(), params=params, timeout=10)
        response.raise_for_status()
        result = response.json()
        return result

    def repo_url(repo, suffix=''):
        return BASE_URL + '/' + SERVICE + '/' + repo.owner + '/repos/' + repo.name + '/' + suffix

    def get_repository_info(repo):
        url = Codecov.repo_url(repo)
        try:
            response = Codecov.get(url)
            return response
        except requests.exceptions.RequestException as err:
            print(err)
            return None

    def get_pull_requests(repo, params):
        url = Codecov.repo_url(repo, 'pulls/')
        response = Codecov.get(url, params)
        return response['results']

    def get_commits(repo, params):
        url = Codecov.repo_url(repo, 'commits/')
        response = Codecov.get(url, params)
        return response['results']
