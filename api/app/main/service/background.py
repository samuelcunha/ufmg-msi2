from app.main.service.pull_request_service import find_pull_requests
from app.main.service.repository_service import find_repository_info, get_outdated_repositories, get_pending_repositories, set_repository_processed
from app.main import scheduler

@scheduler.task('interval', id='do_job_1', seconds=20, misfire_grace_time=900)
def job1():
    with scheduler.app.app_context():
        try:
            process()
        except Exception as err:
            print("Process error: ", err)

def process():
    new_repos = get_pending_repositories()
    process_new_repositories(new_repos)
    # outdated_repos = get_outdated_repositories()
    # update_repositories(outdated_repos)
    
def process_new_repositories(new_repos):
    print("Processing new repositories")
    for repo in new_repos:
        try:
            if find_repository_info(repo):
                if find_pull_requests(repo):
                    set_repository_processed(repo)
                #   if find_commits(repo):
        except Exception as err:
            print("Repository error: ", err)
                

def update_repositories():
    pass
    