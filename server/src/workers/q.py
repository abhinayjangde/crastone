import redis
from rq import Queue
import os

# for local development
# q = Queue(connection=Redis(host=os.getenv("REDIS_HOST"), port=int(os.getenv("REDIS_PORT"))))

q = Queue(connection=redis.from_url(os.getenv("REDIS_URL")))