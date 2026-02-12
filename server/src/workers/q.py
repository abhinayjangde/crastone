from redis import Redis
from rq import Queue
import os

q = Queue(connection=Redis(host=os.getenv("REDIS_HOST"), port=int(os.getenv("REDIS_PORT"))))