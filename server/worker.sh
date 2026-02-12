#!/bin/bash

set -a
source .env
set +a

uv run --env-file=.env rq worker --with-scheduler --url "$REDIS_URL" --worker-class rq.worker.SimpleWorker