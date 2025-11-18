#!/bin/bash

# Production Restore Script for PLP Portal
# This script uses the production DATABASE_URL

# Set production database URL
export DATABASE_URL="postgresql://plp_portal_user:remruata.123@localhost:5432/plp_portal_db"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "❌ Error: Backup file not specified"
    echo "Usage: $0 <backup_file.sql.gz>"
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the main restore script
"$SCRIPT_DIR/restore-production.sh" "$1"

