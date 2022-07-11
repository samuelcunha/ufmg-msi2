from .. import db
from sqlalchemy.sql import func

from sqlalchemy.orm import relationship


class PullRequest(db.Model):
    """ Pull request Model for storing pull request related details """
    __tablename__ = "pull_request"

    id = db.Column(db.String(255), primary_key=True)
    repository_id = db.Column(db.Integer, db.ForeignKey('repository.id'), primary_key=True)
    repository = relationship("Repository", lazy='joined')
    coverage_base = db.Column(db.Float, nullable=True)
    coverage_head = db.Column(db.Float, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=True,  server_default=func.now())

    def __repr__(self):
        return "<Pull request '{}'>".format(self.id)
