#!/bin/bash

# Complete Workflow: Download Production Backup, Restore, and Sync Schema
# Usage: ./restore-and-sync.sh [backup_file.sql.gz]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${GREEN}🚀 Starting complete restore and sync workflow...${NC}"
echo ""

# Step 1: Download backup (if not provided)
if [ -z "$1" ]; then
    echo -e "${GREEN}📥 Step 1: Downloading latest production backup...${NC}"
    "$SCRIPT_DIR/download-prod-backup.sh"
    echo ""
    
    # Get the latest downloaded backup
    LATEST_BACKUP=$(ls -t ./backups/plp_portal_backup_*.sql.gz 2>/dev/null | head -1)
    if [ -z "$LATEST_BACKUP" ]; then
        echo -e "${RED}❌ No backup file found${NC}"
        exit 1
    fi
    BACKUP_FILE="$LATEST_BACKUP"
    echo "Using backup: $BACKUP_FILE"
else
    BACKUP_FILE="$1"
    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}🔄 Step 2: Restoring backup to local database...${NC}"
"$SCRIPT_DIR/restore-local.sh" "$BACKUP_FILE"

echo ""
echo -e "${GREEN}🔄 Step 3: Syncing database schema...${NC}"
"$SCRIPT_DIR/sync-schema.sh"

echo ""
echo -e "${GREEN}🎉 Complete workflow finished!${NC}"
echo ""
echo "Your local database has been:"
echo "  ✅ Restored from production backup"
echo "  ✅ Synced with Prisma schema"
echo "  ✅ Ready to use"

