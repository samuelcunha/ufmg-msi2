from app.main.service.pull_request_service import find_pull_requests
from app.main.service.repository_service import find_repository_info, set_repositories_to_update, get_pending_repositories, set_repository_processed, set_repository_with_error
from app.main import scheduler

@scheduler.task('interval', id='do_job_1', seconds=60, misfire_grace_time=900)
def job1():
    with scheduler.app.app_context():
        try:
            process()
        except Exception as err:
            print("Process error: ", err)

def process():
    print("Processing new repositories")
    new_repos = get_pending_repositories()
    process_new_repositories(new_repos)
    print("Updating repositories")
    set_repositories_to_update()
    
def process_new_repositories(new_repos):
    
    for repo in new_repos:
        try:
            if find_repository_info(repo):
                if find_pull_requests(repo):
                    set_repository_processed(repo)
        except Exception as error:
            set_repository_with_error(repo, str(error))
            print("Repository error: ", error)
                