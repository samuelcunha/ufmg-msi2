import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    DEBUG = False
    # Swagger
    RESTX_MASK_SWAGGER = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://admin:NBE4N4F4MLD47EKQLCX4LZA7BP9TR8BG@msi2.czwrn2c96dz4.us-east-1.rds.amazonaws.com/coverage'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    use_reloader=False
    SCHEDULER_API_ENABLED = True


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'database_test.db')
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(Config):
    DEBUG = False

config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)