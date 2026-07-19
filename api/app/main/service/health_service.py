from sqlalchemy import text

from app.main import db, scheduler


def get_health():
    checks = {}

    try:
        db.session.execute(text('SELECT 1'))
        checks['database'] = 'ok'
    except Exception:
        db.session.rollback()
        checks['database'] = 'error'

    checks['scheduler'] = 'ok' if scheduler.running else 'stopped'

    healthy = all(value == 'ok' for value in checks.values())
    return {'status': 'ok' if healthy else 'degraded', 'checks': checks}, healthy
