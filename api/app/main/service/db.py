from app.main import db
from app.main.model.repository import Repository


def save(data: Repository) -> None:
    db.session.add(data)
    db.session.commit()