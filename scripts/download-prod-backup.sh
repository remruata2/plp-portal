#!/bin/bash

# Simple script to download production backup
# Usage: ./download-prod-backup.sh [backup_filename]
#   If no filename specified, downloads the latest backup

set -e

# Configuration
PROD_SERVER="147.79.67.158"  # Your server hostname or IP
PROD_USER="root"
PROD_BACKUP_DIR="/var/www/plp-portal/backups"
LOCAL_BACKUP_DIR="./backups"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Create local backup directory
mkdir -p "$LOCAL_BACKUP_DIR"

# If backup file is specified, use it; otherwise get latest
if [ -n "$1" ]; then
    BACKUP_FILE="${PROD_BACKUP_DIR}/$1"
    BACKUP_FILENAME="$1"
else
    echo -e "${GREEN}Finding latest backup on production server...${NC}"
    BACKUP_FILE=$(ssh "${PROD_USER}@${PROD_SERVER}" "ls -t ${PROD_BACKUP_DIR}/plp_portal_backup_*.sql.gz | head -1")
    if [ -z "$BACKUP_FILE" ]; then
        echo -e "${RED}❌ No backup file found${NC}"
        exit 1
    fi
    BACKUP_FILENAME=$(basename "$BACKUP_FILE")
    echo "Latest backup: $BACKUP_FILENAME"
fi

LOCAL_BACKUP_PATH="${LOCAL_BACKUP_DIR}/${BACKUP_FILENAME}"

# Download the backup
echo -e "${GREEN}⬇️  Downloading ${BACKUP_FILENAME}...${NC}"
scp "${PROD_USER}@${PROD_SERVER}:${BACKUP_FILE}" "$LOCAL_BACKUP_PATH"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$LOCAL_BACKUP_PATH" | cut -f1)
    echo -e "${GREEN}✅ Download completed!${NC}"
    echo "   File: $LOCAL_BACKUP_PATH"
    echo "   Size: $BACKUP_SIZE"
    echo ""
    echo "To restore this backup to your local database, run:"
    echo "  ./scripts/restore-local.sh $LOCAL_BACKUP_PATH"
else
    echo -e "${RED}❌ Download failed!${NC}"
    exit 1
fi

