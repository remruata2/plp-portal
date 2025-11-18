#!/bin/bash

# Sync Database Schema with Prisma Schema
# This script ensures the database matches the current Prisma schema
# Usage: ./sync-schema.sh [--force-reset]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔄 Syncing database schema with Prisma schema...${NC}"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  DATABASE_URL not set. Using default local connection...${NC}"
    echo "Using default: postgresql://postgres@localhost:5432/plp_portal"
    export DATABASE_URL="postgresql://postgres@localhost:5432/plp_portal"
fi

# Check if --force-reset flag is provided
if [ "$1" == "--force-reset" ]; then
    echo -e "${RED}⚠️  WARNING: --force-reset will drop all data!${NC}"
    read -p "Are you sure you want to reset the database? (yes/no): " CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        echo "Operation cancelled."
        exit 0
    fi
    echo ""
    echo -e "${GREEN}🔄 Resetting database and syncing schema...${NC}"
    npx prisma db push --force-reset --accept-data-loss
else
    echo -e "${GREEN}🔄 Pushing schema changes to database...${NC}"
    echo "This will add missing tables/columns but won't delete existing data."
    echo ""
    npx prisma db push
fi

echo ""
echo -e "${GREEN}✅ Generating Prisma Client...${NC}"
npx prisma generate

echo ""
echo -e "${GREEN}✅ Schema sync completed!${NC}"
echo ""
echo "Your database is now in sync with the Prisma schema."

