#!/bin/bash

# تنظیم متغیرهای محیطی
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"
S3_BUCKET="your-backup-bucket"
MONGO_HOST="mongodb"
MONGO_PORT="27017"
MONGO_DB="your_database"

# ایجاد دایرکتوری برای پشتیبان
mkdir -p "$BACKUP_DIR/db"
mkdir -p "$BACKUP_DIR/files"
mkdir -p "$BACKUP_DIR/configs"

# پشتیبان‌گیری از MongoDB
mongodump --host $MONGO_HOST --port $MONGO_PORT --db $MONGO_DB --out "$BACKUP_DIR/db/mongo_$TIMESTAMP"

# پشتیبان‌گیری از فایل‌های آپلود شده
tar -czf "$BACKUP_DIR/files/uploads_$TIMESTAMP.tar.gz" /app/uploads

# پشتیبان‌گیری از فایل‌های کانفیگ
tar -czf "$BACKUP_DIR/configs/configs_$TIMESTAMP.tar.gz" /app/config

# آپلود به S3
aws s3 sync $BACKUP_DIR "s3://$S3_BUCKET/backups/$TIMESTAMP/"

# پاک کردن پشتیبان‌های قدیمی (نگهداری 7 روز آخر)
find $BACKUP_DIR -type f -mtime +7 -delete

# ارسال نوتیفیکیشن
curl -X POST -H "Content-Type: application/json" \
     -d "{\"text\": \"Backup completed for $TIMESTAMP\"}" \
     $SLACK_WEBHOOK_URL