import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { spawn } from 'child_process';
import { logger } from '../utils/logger';

export class BackupService {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
    this.bucket = process.env.BACKUP_BUCKET || '';
  }

  async listBackups(): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: 'backups/'
      });

      const response = await this.s3Client.send(command);
      return (response.Contents || [])
        .map(obj => obj.Key || '')
        .filter(key => key.endsWith('.tar.gz'));
    } catch (error) {
      logger.error('Failed to list backups:', error);
      throw error;
    }
  }

  async restoreBackup(backupKey: string): Promise<void> {
    try {
      // دانلود فایل پشتیبان از S3
      const getCommand = new GetObjectCommand({
        Bucket: this.bucket,
        Key: backupKey
      });

      const response = await this.s3Client.send(getCommand);
      const backupPath = `/tmp/${backupKey.split('/').pop()}`;

      // بازیابی دیتابیس
      if (backupKey.includes('mongo')) {
        await this.restoreDatabase(backupPath);
      }
      // بازیابی فایل‌ها
      else if (backupKey.includes('uploads')) {
        await this.restoreFiles(backupPath);
      }
      // بازیابی کانفیگ‌ها
      else if (backupKey.includes('configs')) {
        await this.restoreConfigs(backupPath);
      }

      logger.info(`Restored backup: ${backupKey}`);
    } catch (error) {
      logger.error('Backup restoration failed:', error);
      throw error;
    }
  }

  private async restoreDatabase(backupPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const mongorestore = spawn('mongorestore', [
        '--host', process.env.MONGO_HOST || 'localhost',
        '--port', process.env.MONGO_PORT || '27017',
        '--db', process.env.MONGO_DB || 'your_database',
        backupPath
      ]);

      mongorestore.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`mongorestore failed with code ${code}`));
      });
    });
  }

  private async restoreFiles(backupPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tar = spawn('tar', ['-xzf', backupPath, '-C', '/app/uploads']);
      tar.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`tar extraction failed with code ${code}`));
      });
    });
  }

  private async restoreConfigs(backupPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tar = spawn('tar', ['-xzf', backupPath, '-C', '/app/config']);
      tar.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`tar extraction failed with code ${code}`));
      });
    });
  }
}