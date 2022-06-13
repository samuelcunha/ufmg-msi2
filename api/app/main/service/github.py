import requests


class Github:

    headers = {
        'Authorization': 'token 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'
    }

    def get(url):
        try:
            response = requests.get(url, headers=Github.headers, timeout=3)
            response.raise_for_status()
            result = response.json()
            return result
        except requests.exceptions.RequestException as err:
            if response.status_code == 403:
                return None
            else:
                print(err)
                return None

    def get_repository_info(repo):
        info = {
            'license': Github.get_license(repo),
            'main_language': Github.get_main_language(repo)
        }
        print(info)
        return info

    def get_main_language(repo):
        repo_name = repo.owner + '/' + repo.name
        url = 'https://api.github.com/repos/' + repo_name + '/languages'

        main_language = None

        response = Github.get(url)
        if response is not None:
            languages = response.keys()
            if len(languages) > 0:
                main_language = list(languages)[0].lower()

        return main_language

    def get_license(repo):
        repo_name = repo.owner + '/' + repo.name
        url = 'https://api.github.com/repos/' + repo_name + '/license'

        license = None
        response = Github.get(url)
        if response is not None:
            license = response['license']['key']
        return license
