"""Add faiss_id column to images table

Revision ID: <new_revision_id>
Revises: <previous_revision_id>
Create Date: <current_date>

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('images', sa.Column('faiss_id', sa.Integer(), nullable=True))
    op.create_index(op.f('ix_images_faiss_id'), 'images', ['faiss_id'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_images_faiss_id'), table_name='images')
    op.drop_column('images', 'faiss_id')
