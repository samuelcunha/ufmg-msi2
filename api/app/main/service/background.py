from app.main.service.commit_service import find_commits
from app.main.service.pull_request_service import find_pull_requests
from app.main.service.repository_service import find_repository_info, set_repositories_to_update, get_pending_repositories, set_repository_processed, set_repository_with_error
from app.main import scheduler, db


@scheduler.task('interval', id='do_job_1', seconds=120, misfire_grace_time=900)
def job1():
    with scheduler.app.app_context():
        try:
            process()
        except Exception as err:
            print("Process error: ", err)


def process():
    print("Processing pending repositories")
    new_repos = get_pending_repositories()
    print(len(new_repos), "repositories to process")
    process_new_repositories(new_repos)
    print("Finished processing pending repositories")
    
    print("Scheduling repositories to update")
    set_repositories_to_update()
    print("Finished scheduling repositories to update")


def process_new_repositories(new_repos):

    for repo in new_repos:
        try:
            print("Processing: ", repo.name)
            if find_repository_info(repo):
                if find_pull_requests(repo):
                    if find_commits(repo):
                        set_repository_processed(repo)
        except Exception as error:
            set_repository_with_error(repo, str(error))
            print("Repository error: ", error)
