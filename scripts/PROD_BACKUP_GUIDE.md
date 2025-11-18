# Production Backup Guide

## Quick Backup

Simply run:

```bash
./scripts/backup-prod.sh
```

This will:
- Use your production database URL automatically
- Save backups to `/var/www/plp-portal/backups/` by default
- Create a timestamped compressed backup file

## Custom Backup Location

To specify a different backup directory:

```bash
./scripts/backup-prod.sh /path/to/your/backups
```

## Example Usage

```bash
# Navigate to project directory
cd /var/www/plp-portal

# Run backup
./scripts/backup-prod.sh

# Output will show:
# 🚀 Starting production database backup...
# Database: plp_portal_db
# Backup file: /var/www/plp-portal/backups/plp_portal_backup_20250115_143022.sql.gz
# ...
```

## Restore from Backup

```bash
./scripts/restore-prod.sh /var/www/plp-portal/backups/plp_portal_backup_20250115_143022.sql.gz
```

⚠️ **Warning:** This will overwrite your production database!

## Automated Daily Backups

Add to crontab for daily backups at 2 AM:

```bash
crontab -e

# Add this line:
0 2 * * * cd /var/www/plp-portal && ./scripts/backup-prod.sh >> /var/log/plp-backup.log 2>&1
```

## Backup Retention

- Backups older than 30 days are automatically deleted
- You can modify this in `scripts/backup-production.sh` (change `RETENTION_DAYS`)

## Verify Backup

To check if a backup file is valid:

```bash
# Test gzip integrity
gunzip -t /var/www/plp-portal/backups/plp_portal_backup_*.sql.gz

# Preview first 50 lines
gunzip -c /var/www/plp-portal/backups/plp_portal_backup_*.sql.gz | head -50
```

## List Recent Backups

```bash
ls -lh /var/www/plp-portal/backups/plp_portal_backup_*.sql.gz
```

## Security Note

⚠️ The production database credentials are in the script. Make sure:
- The script file has restricted permissions: `chmod 700 scripts/backup-prod.sh`
- The script is not committed to public repositories
- Consider using environment variables or a secrets manager for production

## Troubleshooting

### Permission Denied
```bash
chmod +x scripts/backup-prod.sh
chmod +x scripts/restore-prod.sh
```

### pg_dump not found
```bash
# Install PostgreSQL client
sudo apt-get install postgresql-client  # Ubuntu/Debian
# or
sudo yum install postgresql  # CentOS/RHEL
```

### Cannot connect to database
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database exists: `psql -U plp_portal_user -d plp_portal_db -c "SELECT 1;"`
- Verify credentials are correct

