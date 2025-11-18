#!/bin/bash

# Production Backup Script for PLP Portal
# This script uses the production DATABASE_URL

# Set production database URL
export DATABASE_URL="postgresql://plp_portal_user:remruata.123@localhost:5432/plp_portal_db"

# Default backup directory (can be overridden)
BACKUP_DIR="${1:-/var/www/plp-portal/backups}"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the main backup script
"$SCRIPT_DIR/backup-production.sh" "$BACKUP_DIR"

