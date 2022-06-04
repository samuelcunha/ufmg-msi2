
from app.main.util.enum import RepositoryStatusEnum
from .. import db
from sqlalchemy.sql import func


class Repository(db.Model):
    """ Repository Model for storing repository related details """
    __tablename__ = "repository"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    owner = db.Column(db.String(255), nullable=False)
    origin = db.Column(db.String(255), nullable=False)
    coverage = db.Column(db.Float, nullable=True)
    main_language = db.Column(db.String(255), nullable=True)
    license = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(255), nullable=True, default=RepositoryStatusEnum.PENDING,
                       server_default=RepositoryStatusEnum.PENDING)
    status_info = db.Column(db.String(500), nullable=False,
                            default='', server_default='')
    updated = db.Column(db.DateTime, nullable=True,  server_default=func.now())

    def __repr__(self):
        return "<Repository '{}'>".format(self.name)
