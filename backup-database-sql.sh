#!/bin/bash

# Database backup script for PLP Portal (SQL format)
# Usage: ./backup-database-sql.sh

# Database credentials
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="plp_portal_db"
DB_USER="plp_portal_user"
DB_PASSWORD="remruata.123"

# Create backups directory if it doesn't exist
BACKUP_DIR="/var/www/plp-portal/backups"
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/plp_portal_backup_$TIMESTAMP.sql"

# Set PGPASSWORD environment variable
export PGPASSWORD="$DB_PASSWORD"

# Create backup (SQL format - plain text, readable)
echo "Creating database backup..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F p -b -v -f "$BACKUP_FILE"

# Compress the SQL file
if [ -f "$BACKUP_FILE" ]; then
    echo "Compressing backup..."
    gzip "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
fi

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✓ Backup created successfully: $BACKUP_FILE"
    ls -lh "$BACKUP_FILE"
else
    echo "✗ Backup failed!"
    exit 1
fi

# Unset password
unset PGPASSWORD

