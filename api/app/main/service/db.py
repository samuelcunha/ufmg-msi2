from app.main import db


def save(data):
    db.session.add(data)
    db.session.commit()


def update(model, id, data):
    item = db.session.query(model).get(id)
    
    for key, value in data.items():
        setattr(item, key, value)

    db.session.commit()
    db.session.flush()
