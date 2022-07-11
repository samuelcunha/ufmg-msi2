import requests


class Codecov:
    headers = {}

    def get(url, params={}, headers=headers):
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        result = response.json()
        return result


    def get_repository_info(repo):
        url = 'https://codecov.io/api/gh/' + repo.owner + '/' + repo.name
        try:
            response = Codecov.get(url)
            return response
        except requests.exceptions.RequestException as err:
            print(err)
            return None
        
    def get_pull_requests(repo, params):
        url = 'https://codecov.io/api/gh/' + repo.owner + '/' + repo.name + '/pulls'
        response = Codecov.get(url, params)
        return response['pulls']
    
    def get_commits(repo, params):
        url = 'https://codecov.io/api/gh/' + repo.owner + '/' + repo.name + '/commits'
        response = Codecov.get(url, params)
        return response['commits']