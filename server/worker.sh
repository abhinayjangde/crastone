#!/bin/bash

uv run --env-file=.env rq worker --with-scheduler --url redis://localhost:6379 --worker-class rq.worker.SimpleWorker