"""Remove embeddings table

Revision ID: c912764e2d9e
Revises: a1b2c3d4e5f6
Create Date: 2025-08-12 21:02:51.408854

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'c912764e2d9e'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Remove the embeddings table (indexes and constraints will be dropped automatically)
    op.drop_table('embeddings')


def downgrade() -> None:
    """Downgrade schema."""
    # Restore the embeddings table and its indexes
    op.create_table('embeddings',
        sa.Column('image_id', mysql.INTEGER(), autoincrement=False, nullable=True),
        sa.Column('item_id', mysql.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('embed_id', mysql.INTEGER(), autoincrement=True, nullable=False),
        sa.ForeignKeyConstraint(['image_id'], ['images.image_id'], name=op.f('embeddings_ibfk_1')),
        sa.ForeignKeyConstraint(['item_id'], ['items.item_id'], name=op.f('embeddings_ibfk_2')),
        sa.PrimaryKeyConstraint('embed_id'),
        mysql_collate='utf8mb4_0900_ai_ci',
        mysql_default_charset='utf8mb4',
        mysql_engine='InnoDB'
    )
    op.create_index(op.f('ix_embeddings_image_id'), 'embeddings', ['image_id'], unique=False)
    op.create_index(op.f('ix_embeddings_embed_id'), 'embeddings', ['embed_id'], unique=False)
    op.create_index(op.f('item_id'), 'embeddings', ['item_id'], unique=True)
