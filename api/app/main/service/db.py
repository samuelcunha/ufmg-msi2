from app.main import db


def insert(item):
    db.session.add(item)
    db.session.commit()


def insert_many(items):
    db.session.add_all(items)
    db.session.commit()


def insert_ignore_many(model, items):
    if len(items):
        db.session.execute(model.__table__.insert().prefix_with('IGNORE').values(items))
        db.session.commit()


def update(model, id, data):
    item = db.session.query(model).get(id)

    for key, value in data.items():
        setattr(item, key, value)

    db.session.commit()
    db.session.flush()
