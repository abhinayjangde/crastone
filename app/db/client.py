from pymongo import AsyncMongoClient
from dotenv import load_dotenv
load_dotenv()
import os

mongo_client: AsyncMongoClient = AsyncMongoClient(os.getenv("MONGODB_URI"))