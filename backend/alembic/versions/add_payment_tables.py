"""Add payment tables

Revision ID: add_payment_tables
Revises: e7fbcdd4a53b
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_payment_tables'
down_revision = 'e7fbcdd4a53b'
branch_labels = None
depends_on = None


def upgrade():
    # Create payment_transactions table
    op.create_table('payment_transactions',
        sa.Column('transaction_id', sa.Integer(), nullable=False),
        sa.Column('lost_report_id', sa.Integer(), nullable=False),
        sa.Column('payer_id', sa.Integer(), nullable=False),
        sa.Column('payee_id', sa.Integer(), nullable=True),
        sa.Column('amount', sa.DECIMAL(precision=10, scale=2), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('stripe_payment_intent_id', sa.String(length=255), nullable=True),
        sa.Column('stripe_transfer_id', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['lost_report_id'], ['lost_reports.lost_report_id'], ),
        sa.ForeignKeyConstraint(['payer_id'], ['users.user_id'], ),
        sa.ForeignKeyConstraint(['payee_id'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('transaction_id')
    )
    op.create_index(op.f('ix_payment_transactions_transaction_id'), 'payment_transactions', ['transaction_id'], unique=False)

    # Create bounty_claims table
    op.create_table('bounty_claims',
        sa.Column('claim_id', sa.Integer(), nullable=False),
        sa.Column('lost_report_id', sa.Integer(), nullable=False),
        sa.Column('finder_id', sa.Integer(), nullable=False),
        sa.Column('claim_message', sa.Text(), nullable=False),
        sa.Column('contact_info', sa.String(length=255), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('reviewed_by', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['finder_id'], ['users.user_id'], ),
        sa.ForeignKeyConstraint(['lost_report_id'], ['lost_reports.lost_report_id'], ),
        sa.ForeignKeyConstraint(['reviewed_by'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('claim_id')
    )
    op.create_index(op.f('ix_bounty_claims_claim_id'), 'bounty_claims', ['claim_id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_bounty_claims_claim_id'), table_name='bounty_claims')
    op.drop_table('bounty_claims')
    op.drop_index(op.f('ix_payment_transactions_transaction_id'), table_name='payment_transactions')
    op.drop_table('payment_transactions')
