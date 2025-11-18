# Restore Production Backup to Local Database

## Complete Workflow (Recommended)

The easiest way to restore and sync everything:

```bash
./scripts/restore-and-sync.sh
```

This will:

1. Download the latest production backup
2. Restore it to your local database
3. Sync the database schema with Prisma schema
4. Generate Prisma Client

## Quick Steps

### Option 1: Download and Restore in One Step

1. **Update the server details in `download-and-restore-prod.sh`:**

   ```bash
   # Edit the script and update:
   PROD_SERVER="srv801756"  # Your server hostname
   PROD_USER="root"
   ```

2. **Run the script:**
   ```bash
   ./scripts/download-and-restore-prod.sh
   ```

### Option 2: Download First, Then Restore (Recommended)

#### Step 1: Download the Backup

1. **Update server details in `download-prod-backup.sh`:**

   ```bash
   # Edit the script and update:
   PROD_SERVER="srv801756"
   PROD_USER="root"
   ```

2. **Download the latest backup:**

   ```bash
   ./scripts/download-prod-backup.sh
   ```

   Or download a specific backup:

   ```bash
   ./scripts/download-prod-backup.sh plp_portal_backup_20251119_000712.sql.gz
   ```

   The backup will be saved to `./backups/`

#### Step 2: Restore to Local Database

1. **Set your local DATABASE_URL:**

   ```bash
   export DATABASE_URL="postgresql://user:password@localhost:5432/plp_portal"
   ```

2. **Restore the backup:**
   ```bash
   ./scripts/restore-local.sh ./backups/plp_portal_backup_20251119_000712.sql.gz
   ```

## Manual Method (Using SCP and psql)

### Step 1: Download from Production Server

```bash
# From your local machine
scp root@srv801756:/var/www/plp-portal/backups/plp_portal_backup_20251119_000712.sql.gz ./backups/
```

### Step 2: Restore to Local Database

```bash
# Set your local database URL
export DATABASE_URL="postgresql://user:password@localhost:5432/plp_portal"

# Restore
gunzip -c ./backups/plp_portal_backup_20251119_000712.sql.gz | psql $DATABASE_URL
```

Or using the restore script:

```bash
./scripts/restore-local.sh ./backups/plp_portal_backup_20251119_000712.sql.gz
```

## Using the Latest Backup Automatically

The download script will automatically find and download the latest backup:

```bash
./scripts/download-prod-backup.sh
# No filename needed - it finds the latest automatically
```

## Example Workflow

```bash
# 1. Download latest production backup
./scripts/download-prod-backup.sh

# Output:
# Finding latest backup on production server...
# Latest backup: plp_portal_backup_20251119_000712.sql.gz
# ⬇️  Downloading plp_portal_backup_20251119_000712.sql.gz...
# ✅ Download completed!
#    File: ./backups/plp_portal_backup_20251119_000712.sql.gz
#    Size: 1.4M

# 2. Set local database URL
export DATABASE_URL="postgresql://postgres:password@localhost:5432/plp_portal"

# 3. Restore to local database
./scripts/restore-local.sh ./backups/plp_portal_backup_20251119_000712.sql.gz

# Output:
# ⚠️  WARNING: This will overwrite your local database!
# Database: plp_portal
# ...
# Are you sure you want to continue? (yes/no): yes
#
# 🔄 Restoring database...
# ✅ Database restored successfully!
# 🎉 Restore process completed!
```

## Troubleshooting

### SSH Connection Issues

If you can't connect via SSH:

1. **Check SSH access:**

   ```bash
   ssh root@srv801756
   ```

2. **Use IP address instead:**
   ```bash
   # Update PROD_SERVER in the script to use IP
   PROD_SERVER="your.server.ip.address"
   ```

### Database Connection Issues

1. **Verify DATABASE_URL is set:**

   ```bash
   echo $DATABASE_URL
   ```

2. **Test database connection:**

   ```bash
   psql $DATABASE_URL -c "SELECT 1;"
   ```

3. **Check PostgreSQL is running:**

   ```bash
   # macOS
   brew services list | grep postgresql

   # Linux
   sudo systemctl status postgresql
   ```

### Permission Issues

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Check file permissions
ls -la scripts/
```

### Backup File Not Found

```bash
# List available backups on production server
ssh root@srv801756 "ls -lh /var/www/plp-portal/backups/"
```

## Security Notes

- ⚠️ The restore will **overwrite** your local database
- Make sure you have a backup of your local database if needed
- The production backup contains production data - handle with care
- Don't commit production backups to version control

## Sync Schema After Restore

After restoring the production backup, you need to sync your database with the Prisma schema:

```bash
./scripts/sync-schema.sh
```

This will:

- Add any missing tables/columns from the schema
- Update the database structure to match Prisma schema
- Generate Prisma Client

**Note:** This won't delete existing data, only add missing schema elements.

### Force Reset (if needed)

If you need to completely reset and resync:

```bash
./scripts/sync-schema.sh --force-reset
```

⚠️ **Warning:** This will delete all data and recreate the database from the schema!

## Verify Restore

After restoring, verify the data:

```bash
# Connect to database
psql $DATABASE_URL

# Check some records
SELECT COUNT(*) FROM facility;
SELECT COUNT(*) FROM indicator;
SELECT COUNT(*) FROM user;

# Exit
\q
```
