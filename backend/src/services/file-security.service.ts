import { Request } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { lookup } from 'mime-types';
import { execFile } from 'child_process';
import ClamAV from 'clamav.js';
import { logger } from '../utils/logger';

interface FileSecurityConfig {
  maxSize: number;
  allowedTypes: string[];
  scanForMalware: boolean;
  storageLocation: string;
  allowedExtensions: string[];
  maxFilenameLength: number;
}

export class FileSecurityService {
  private config: FileSecurityConfig;
  private clamav: typeof ClamAV;
  private storage: multer.StorageEngine;

  constructor() {
    this.config = {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/plain',
      ],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'],
      maxFilenameLength: 100,
      scanForMalware: true,
      storageLocation: path.join(process.cwd(), 'uploads')
    };

    this.initializeStorage();
    this.initializeAntivirus();
  }

  private initializeStorage() {
    this.storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        try {
          await fs.mkdir(this.config.storageLocation, { recursive: true });
          cb(null, this.config.storageLocation);
        } catch (error) {
          cb(error as Error, '');
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    });
  }

  private initializeAntivirus() {
    if (this.config.scanForMalware) {
      this.clamav = new ClamAV();
      this.clamav.init({
        removeInfected: true,
        quarantineInfected: true,
        scanLog: null,
        debugMode: false,
        fileList: null,
        scanLogTime: true
      });
    }
  }

  public getUploadMiddleware() {
    const upload = multer({
      storage: this.storage,
      limits: {
        fileSize: this.config.maxSize,
        files: 5 // Maximum number of files
      },
      fileFilter: (req, file, cb) => {
        this.validateFile(file)
          .then(() => cb(null, true))
          .catch(error => cb(error));
      }
    });

    return upload;
  }

  private async validateFile(file: Express.Multer.File): Promise<void> {
    // Check file type
    if (!this.config.allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed`);
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!this.config.allowedExtensions.includes(ext)) {
      throw new Error(`File extension ${ext} is not allowed`);
    }

    // Check filename length
    if (file.originalname.length > this.config.maxFilenameLength) {
      throw new Error('Filename is too long');
    }

    // Additional security checks
    await this.performSecurityChecks(file);
  }

  private async performSecurityChecks(file: Express.Multer.File): Promise<void> {
    try {
      // Check file content type matches extension
      const detectedMime = lookup(file.originalname);
      if (detectedMime && detectedMime !== file.mimetype) {
        throw new Error('File type mismatch');
      }

      // Check for executable content
      const buffer = await fs.readFile(file.path);
      if (this.containsExecutableContent(buffer)) {
        throw new Error('File contains executable content');
      }

      // Scan for malware
      if (this.config.scanForMalware) {
        await this.scanForMalware(file.path);
      }

      // Calculate file hash
      const hash = await this.calculateFileHash(file.path);
      
      // Log file upload
      logger.info('File uploaded successfully', {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        hash
      });
    } catch (error) {
        // Delete file if any check fails
        await fs.unlink(file.path).catch(err => 
          logger.error('Failed to delete file after failed checks:', err)
        );
        throw error;
    }
  }

  private containsExecutableContent(buffer: Buffer): boolean {
    // Check for common executable signatures
    const executableSignatures = [
      Buffer.from('4D5A'), // MZ (DOS/PE)
      Buffer.from('7F454C46'), // ELF
      Buffer.from('cafebabe'), // Java class
      Buffer.from('#!/'), // Shell script
    ];

    return executableSignatures.some(signature => 
      buffer.includes(signature)
    );
  }

  private async scanForMalware(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clamav.scan_file(filePath, (err, object, malicious) => {
        if (err) {
          reject(new Error('Virus scan failed'));
        } else if (malicious) {
          reject(new Error('Malware detected'));
        } else {
          resolve();
        }
      });
    });
  }

  private async calculateFileHash(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  public async processUploadedFile(file: Express.Multer.File): Promise<string> {
    try {
      // Generate safe filename
      const safeFilename = this.generateSafeFilename(file.originalname);
      
      // Move file to permanent storage
      const finalPath = path.join(this.config.storageLocation, safeFilename);
      await fs.rename(file.path, finalPath);

      // Create thumbnail if image
      if (file.mimetype.startsWith('image/')) {
        await this.createThumbnail(finalPath);
      }

      return safeFilename;
    } catch (error) {
      logger.error('Failed to process uploaded file:', error);
      throw error;
    }
  }

  private generateSafeFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const basename = path.basename(originalName, ext)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${basename}-${timestamp}-${random}${ext}`;
  }

  private async createThumbnail(filePath: string): Promise<void> {
    // Implementation for creating thumbnails
    // This would typically use something like Sharp or ImageMagick
  }
}