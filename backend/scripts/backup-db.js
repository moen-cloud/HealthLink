require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Backup configuration
const BACKUP_DIR = path.join(__dirname, '../backups');
const MONGODB_URI = process.env.MONGODB_URI;
const BACKUP_RETENTION_DAYS = 7; // Keep backups for 7 days

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `healthlink-backup-${timestamp}`);

console.log('🔄 Starting database backup...');
console.log(`📁 Backup location: ${backupFile}`);

// Run mongodump command
const dumpCommand = `mongodump --uri="${MONGODB_URI}" --out="${backupFile}"`;

exec(dumpCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }

  console.log('✅ Database backup completed successfully!');
  console.log(stdout);

  // Clean up old backups
  cleanupOldBackups();
});

// Remove backups older than retention period
function cleanupOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR);
  const now = Date.now();
  const retentionMs = BACKUP_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  files.forEach(file => {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    const age = now - stats.mtimeMs;

    if (age > retentionMs) {
      fs.rmSync(filePath, { recursive: true, force: true });
      console.log(`🗑️  Removed old backup: ${file}`);
    }
  });
}

// Schedule daily backups (add to cron job or use node-cron)
// Example cron: 0 2 * * * node /path/to/backup-db.js (daily at 2 AM)