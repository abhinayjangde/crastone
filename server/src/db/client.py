from pymongo import AsyncMongoClient, MongoClient
import os

mongo_client: AsyncMongoClient = AsyncMongoClient(os.getenv("DATABASE_URL"))
sync_mongo_client: MongoClient = MongoClient(os.getenv("DATABASE_URL"))