# Database Backup & Restore Guide

## Production Backup Script

### Quick Start

1. **Set your production DATABASE_URL:**
   ```bash
   export DATABASE_URL="postgresql://user:password@host:port/database"
   ```

2. **Run the backup:**
   ```bash
   ./scripts/backup-production.sh [backup_directory]
   ```

   If no directory is specified, backups will be saved to `./backups/`

### Features

- ✅ Creates compressed SQL backups (`.sql.gz`)
- ✅ Includes timestamp in filename
- ✅ Automatically cleans up backups older than 30 days
- ✅ Shows backup size and location
- ✅ Lists recent backups

### Example Output

```
🚀 Starting production database backup...
Database: plp_portal
Backup file: ./backups/plp_portal_backup_20250115_143022.sql.gz

📦 Creating backup...
✅ Backup completed successfully!
   File: ./backups/plp_portal_backup_20250115_143022.sql.gz
   Size: 2.5M

🧹 Cleaning up old backups (older than 30 days)...
✅ Cleanup completed

📋 Recent backups:
-rw-r--r--  1 user  staff   2.5M Jan 15 14:30 plp_portal_backup_20250115_143022.sql.gz

🎉 Backup process completed!
```

## Restore Script

### Usage

```bash
./scripts/restore-production.sh <backup_file.sql.gz>
```

### Example

```bash
export DATABASE_URL="postgresql://user:password@host:port/database"
./scripts/restore-production.sh ./backups/plp_portal_backup_20250115_143022.sql.gz
```

⚠️ **Warning:** This will overwrite the existing database!

## Automated Backups (Cron)

To set up daily backups, add to your crontab:

```bash
# Edit crontab
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * cd /path/to/plp-portal && export DATABASE_URL="your_production_url" && ./scripts/backup-production.sh /path/to/backups >> /var/log/plp-backup.log 2>&1
```

## Manual Backup (Alternative)

If you prefer to use pg_dump directly:

```bash
# Set connection details
export PGPASSWORD="your_password"

# Create backup
pg_dump -h your_host -p 5432 -U your_user -d plp_portal \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Unset password
unset PGPASSWORD
```

## Backup Storage Recommendations

1. **Local Storage:** Keep recent backups on the server
2. **Remote Storage:** Copy backups to:
   - AWS S3
   - Google Cloud Storage
   - Another server via SCP/SFTP
   - Cloud backup service

### Example: Copy to S3

```bash
# After backup, copy to S3
aws s3 cp ./backups/plp_portal_backup_*.sql.gz s3://your-bucket/backups/
```

### Example: Copy to Remote Server

```bash
# After backup, copy to remote server
scp ./backups/plp_portal_backup_*.sql.gz user@remote-server:/backups/
```

## Verification

To verify a backup file:

```bash
# Check if file is valid gzip
gunzip -t backup_file.sql.gz

# Preview backup contents (first 50 lines)
gunzip -c backup_file.sql.gz | head -50
```

## Troubleshooting

### Error: DATABASE_URL not set
- Make sure to export DATABASE_URL before running the script
- Or add it to your `.env` file and source it

### Error: pg_dump: command not found
- Install PostgreSQL client tools:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install postgresql-client
  
  # macOS
  brew install postgresql
  ```

### Error: Permission denied
- Make sure the script is executable:
  ```bash
  chmod +x scripts/backup-production.sh
  ```

### Error: Connection refused
- Check that your DATABASE_URL is correct
- Verify the database server is accessible
- Check firewall rules

