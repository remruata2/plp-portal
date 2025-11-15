#!/bin/bash

# Database backup script for PLP Portal
# Usage: ./backup-database.sh

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
BACKUP_FILE="$BACKUP_DIR/plp_portal_backup_$TIMESTAMP.dump"

# Set PGPASSWORD environment variable
export PGPASSWORD="$DB_PASSWORD"

# Create backup (custom format - compressed, faster restore)
echo "Creating database backup..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F c -b -v -f "$BACKUP_FILE"

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

