#!/bin/bash

# Restore Production Backup to Local Database
# Usage: ./restore-local.sh <backup_file.sql.gz>

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Backup file not specified${NC}"
    echo "Usage: $0 <backup_file.sql.gz>"
    echo ""
    echo "Example:"
    echo "  $0 ./backups/plp_portal_backup_20251119_000712.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  DATABASE_URL not set. Using default local connection...${NC}"
    echo "Using default: postgresql://postgres@localhost:5432/plp_portal"
    DB_USER="postgres"
    DB_PASS=""
    DB_HOST="localhost"
    DB_PORT="5432"
    DB_NAME="plp_portal"
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
            export PGPASSWORD=""
        else
            echo -e "${RED}❌ Error: Could not parse DATABASE_URL${NC}"
            exit 1
        fi
    fi
fi


# Warning
echo -e "${RED}⚠️  WARNING: This will overwrite your local database!${NC}"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Set PGPASSWORD for psql
export PGPASSWORD="$DB_PASS"

echo ""
echo -e "${GREEN}🔄 Restoring database...${NC}"

# Restore the backup
if gunzip -c "$BACKUP_FILE" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; then
    echo ""
    echo -e "${GREEN}✅ Database restored successfully!${NC}"
else
    echo ""
    echo -e "${RED}❌ Restore failed!${NC}"
    exit 1
fi

# Unset PGPASSWORD for security
unset PGPASSWORD

echo ""
echo -e "${GREEN}🎉 Restore process completed!${NC}"
echo ""
echo "Your local database has been replaced with the production backup."

