from app.main import db


def insert(item):
    try:
        db.session.add(item)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise


def insert_many(items):
    try:
        db.session.add_all(items)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise


def insert_ignore_many(model, items):
    if len(items):
        try:
            db.session.execute(model.__table__.insert().prefix_with('IGNORE').values(items))
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise


def update(model, id, data):
    try:
        item = db.session.query(model).get(id)

        for key, value in data.items():
            setattr(item, key, value)

        db.session.commit()
        db.session.flush()
    except Exception:
        db.session.rollback()
        raise
