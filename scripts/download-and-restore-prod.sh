#!/bin/bash

# Download Production Backup and Restore to Local Database
# Usage: ./download-and-restore-prod.sh [backup_file.sql.gz]
#   If no file specified, downloads the latest backup

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROD_SERVER="147.79.67.158"  # Update this with your server
PROD_USER="root"  # Update if different
PROD_BACKUP_DIR="/var/www/plp-portal/backups"
LOCAL_BACKUP_DIR="./backups"
LOCAL_DB_NAME="plp_portal"

echo -e "${GREEN}📥 Downloading production backup...${NC}"

# Create local backup directory
mkdir -p "$LOCAL_BACKUP_DIR"

# If backup file is specified, use it; otherwise get latest
if [ -n "$1" ]; then
    BACKUP_FILE="$1"
    echo "Using specified backup: $BACKUP_FILE"
else
    echo "Finding latest backup on production server..."
    # Get latest backup file name
    BACKUP_FILE=$(ssh "${PROD_USER}@${PROD_SERVER}" "ls -t ${PROD_BACKUP_DIR}/plp_portal_backup_*.sql.gz | head -1")
    if [ -z "$BACKUP_FILE" ]; then
        echo -e "${RED}❌ No backup file found on production server${NC}"
        exit 1
    fi
    echo "Latest backup: $BACKUP_FILE"
fi

# Extract just the filename
BACKUP_FILENAME=$(basename "$BACKUP_FILE")
LOCAL_BACKUP_PATH="${LOCAL_BACKUP_DIR}/${BACKUP_FILENAME}"

# Download the backup
echo -e "${GREEN}⬇️  Downloading ${BACKUP_FILENAME}...${NC}"
scp "${PROD_USER}@${PROD_SERVER}:${BACKUP_FILE}" "$LOCAL_BACKUP_PATH"

if [ ! -f "$LOCAL_BACKUP_PATH" ]; then
    echo -e "${RED}❌ Download failed!${NC}"
    exit 1
fi

BACKUP_SIZE=$(du -h "$LOCAL_BACKUP_PATH" | cut -f1)
echo -e "${GREEN}✅ Download completed!${NC}"
echo "   File: $LOCAL_BACKUP_PATH"
echo "   Size: $BACKUP_SIZE"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  DATABASE_URL not set. Using default local connection...${NC}"
    echo "Using default: postgresql://postgres@localhost:5432/$LOCAL_DB_NAME"
    DB_HOST="localhost"
    DB_PORT="5432"
    DB_USER="postgres"
    DB_NAME="$LOCAL_DB_NAME"
    export PGPASSWORD=""
else
    # Extract connection details from DATABASE_URL
    DB_URL_REGEX="postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+)"
    if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
        DB_USER="${BASH_REMATCH[1]}"
        DB_PASS="${BASH_REMATCH[2]}"
        DB_HOST="${BASH_REMATCH[3]}"
        DB_PORT="${BASH_REMATCH[4]}"
        DB_NAME="${BASH_REMATCH[5]}"
        # Strip query parameters from database name
        DB_NAME="${DB_NAME%%\?*}"
        export PGPASSWORD="$DB_PASS"
    else
        # Try without password (for local postgres user)
        DB_URL_REGEX_NO_PASS="postgresql://([^@]+)@([^:]+):([^/]+)/(.+)"
        if [[ $DATABASE_URL =~ $DB_URL_REGEX_NO_PASS ]]; then
            DB_USER="${BASH_REMATCH[1]}"
            DB_PASS=""
            DB_HOST="${BASH_REMATCH[2]}"
            DB_PORT="${BASH_REMATCH[3]}"
            DB_NAME="${BASH_REMATCH[4]}"
            # Strip query parameters from database name
            DB_NAME="${DB_NAME%%\?*}"
            export PGPASSWORD=""
        else
            echo -e "${RED}❌ Could not parse DATABASE_URL${NC}"
            exit 1
        fi
    fi
fi

# Warning
echo ""
echo -e "${RED}⚠️  WARNING: This will overwrite your local database!${NC}"
echo "Local database: $DB_NAME"
echo "Backup file: $LOCAL_BACKUP_PATH"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Restore the backup
echo ""
echo -e "${GREEN}🔄 Restoring database...${NC}"

# Drop and recreate database (optional - comment out if you want to keep existing)
# echo "Dropping existing database..."
# dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" || true
# echo "Creating new database..."
# createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"

# Restore the backup
if gunzip -c "$LOCAL_BACKUP_PATH" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; then
    echo -e "${GREEN}✅ Database restored successfully!${NC}"
else
    echo -e "${RED}❌ Restore failed!${NC}"
    exit 1
fi

# Unset PGPASSWORD for security
unset PGPASSWORD

echo ""
echo -e "${GREEN}🎉 Restore process completed!${NC}"
echo ""
echo "Your local database has been replaced with the production backup."
echo "Backup file saved at: $LOCAL_BACKUP_PATH"

