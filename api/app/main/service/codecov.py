import requests


class Codecov:
    def get_repository_info(repo):
        try:
            url = 'https://codecov.io/api/gh/' + repo.owner + '/' + repo.name

            response = requests.get(url, timeout=3)
            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as err:
            print(err)
            return None
