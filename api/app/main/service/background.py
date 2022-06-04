from app.main import scheduler

@scheduler.task('interval', id='do_job_1', seconds=10, misfire_grace_time=900)
def job1():
    with scheduler.app.app_context():
        try:
            process()
        except Exception as err:
            print(err)

def process():
    print("Processing repositories")
