#!/bin/bash

# Production Database Backup Script
# This script creates a compressed backup of the PostgreSQL database
# Usage: ./backup-production.sh [backup_directory]

set -e  # Exit on error

# Configuration
DB_NAME="plp_portal"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${1:-./backups}"
BACKUP_FILE="${BACKUP_DIR}/plp_portal_backup_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30  # Keep backups for 30 days

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}🚀 Starting production database backup...${NC}"
echo "Database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL environment variable is not set${NC}"
    echo "Please set it before running the backup:"
    echo "  export DATABASE_URL='postgresql://user:password@host:port/database'"
    exit 1
fi

# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_URL_REGEX="postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+)"
if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME_FROM_URL="${BASH_REMATCH[5]}"
    
    # Use database name from URL if different
    if [ -n "$DB_NAME_FROM_URL" ]; then
        DB_NAME="$DB_NAME_FROM_URL"
    fi
else
    echo -e "${YELLOW}⚠️  Warning: Could not parse DATABASE_URL, using defaults${NC}"
    echo "Make sure pg_dump can connect using DATABASE_URL"
fi

# Set PGPASSWORD for pg_dump
export PGPASSWORD="$DB_PASS"

# Perform the backup
echo -e "${GREEN}📦 Creating backup...${NC}"
if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    --format=plain \
    | gzip > "$BACKUP_FILE"; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✅ Backup completed successfully!${NC}"
    echo "   File: $BACKUP_FILE"
    echo "   Size: $BACKUP_SIZE"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    exit 1
fi

# Clean up old backups (older than RETENTION_DAYS)
echo ""
echo -e "${YELLOW}🧹 Cleaning up old backups (older than $RETENTION_DAYS days)...${NC}"
find "$BACKUP_DIR" -name "plp_portal_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
echo -e "${GREEN}✅ Cleanup completed${NC}"

# List recent backups
echo ""
echo -e "${GREEN}📋 Recent backups:${NC}"
ls -lh "$BACKUP_DIR"/plp_portal_backup_*.sql.gz 2>/dev/null | tail -5 || echo "No backups found"

# Unset PGPASSWORD for security
unset PGPASSWORD

echo ""
echo -e "${GREEN}🎉 Backup process completed!${NC}"

