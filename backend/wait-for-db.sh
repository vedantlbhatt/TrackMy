#!/bin/sh
until nc -z db 3306; do
  echo "Waiting for MySQL..."
  sleep 2
done
PYTHONPATH=/app python -m app.core.init_db
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload