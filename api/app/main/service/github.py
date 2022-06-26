import requests


class Github:

    # @TODO Use variable for auth key
    headers = {
        'Authorization': 'token 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'
    }

    def get(url, params={}, headers=headers):
        response = requests.get(url, headers=headers, params=params, timeout=3)
        response.raise_for_status()
        result = response.json()
        return result

    def get_repository_info(repo):
        info = {
            'license': Github.get_license(repo),
            'main_language': Github.get_main_language(repo)
        }
        return info

    def get_main_language(repo):
        repo_name = repo.owner + '/' + repo.name
        url = 'https://api.github.com/repos/' + repo_name + '/languages'

        main_language = None
        try:
            response = Github.get(url)
        except requests.exceptions.RequestException as err:
            print(err)
            response = None
        if response is not None:
            languages = response.keys()
            if len(languages) > 0:
                main_language = list(languages)[0].lower()

        return main_language

    def get_license(repo):
        repo_name = repo.owner + '/' + repo.name
        url = 'https://api.github.com/repos/' + repo_name + '/license'

        license = None
        try:
            response = Github.get(url)
        except requests.exceptions.RequestException as err:
            print(err)
            response = None
        if response is not None:
            license = response['license']['key']
        return license
