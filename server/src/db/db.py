from .client import mongo_client
import os

db = mongo_client[os.getenv("DATABASE_NAME")]
