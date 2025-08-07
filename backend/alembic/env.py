# alembic/env.py
import os
import sys

# Add your project's root directory to the Python path
# This ensures your imports work correctly
sys.path.append(os.path.abspath("."))

# Import your settings object
from config import settings

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# this is the Alembic Config object, which provides
# access to values within the .ini file in use.
config = context.config

# interpret the config file for Python's standard logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's Base here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata

# You must also import your models here to allow autogenerate to see them.
from app.models import Base
from app.models import user, item, image, foundReport, lostReport

target_metadata = Base.metadata

# --- THIS IS THE KEY CHANGE ---
# Set the database URI from your settings file
config.set_main_option('sqlalchemy.url', settings.SQLALCHEMY_DATABASE_URI)
# --- END OF KEY CHANGE ---

def run_migrations_offline() -> None:
    # ... (rest of the file remains the same)

def run_migrations_online() -> None:
    # ... (rest of the file remains the same)
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    # ...

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()