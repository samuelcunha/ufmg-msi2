
from .. import db
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Commit(db.Model):
    """ Commit Model for storing commit related details """
    __tablename__ = "commit"

    id = db.Column(db.String(255), primary_key=True)
    repository_id = db.Column(db.Integer, db.ForeignKey('repository.id'))
    repository = relationship("Repository", lazy='joined')
    coverage = db.Column(db.Float, nullable=True)
    branch = db.Column(db.String(255), nullable=False)
    interval = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=True,  server_default=func.now())

    def __repr__(self):
        return "<Commit '{}'>".format(self.id)
