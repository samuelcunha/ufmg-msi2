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
    ERROR_404_HELP = False
    use_reloader=False
    SCHEDULER_API_ENABLED = True
    COVERIT_API_TOKEN='a4144a24-5af6-4b84-aaa9-b4b38fd23b72'


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'database_test.db')
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    COVERIT_API_TOKEN='51a4aa34-fb4a-4d5b-9301-cbfcc747e93b'

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://admin:NBE4N4F4MLD47EKQLCX4LZA7BP9TR8BG@msi2.czwrn2c96dz4.us-east-1.rds.amazonaws.com/coverage'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ERROR_404_HELP = False
    use_reloader=False
    SCHEDULER_API_ENABLED = True
    COVERIT_API_TOKEN='498ccc4d-2b81-4ebe-9322-540b4affb2f3'

config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)