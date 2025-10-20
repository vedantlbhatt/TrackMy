# alembic/env.py
import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Add your project's root directory to the Python path
sys.path.append(os.path.abspath("."))

# Import your settings object
from app.core.config import settings

# this is the Alembic Config object, which provides
# access to values within the .ini file in use.
config = context.config

# interpret the config file for Python's standard logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import all models so Alembic can detect changes
from app.models import Base
from app.models import user, item, image, foundReport, lostReport

target_metadata = Base.metadata

# Set the database URI from your settings file
config.set_main_option('sqlalchemy.url', settings.SQLALCHEMY_DATABASE_URI)


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()