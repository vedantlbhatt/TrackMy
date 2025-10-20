#!/bin/sh
until nc -z db 5432; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done
PYTHONPATH=/app python -m app.core.init_db
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload