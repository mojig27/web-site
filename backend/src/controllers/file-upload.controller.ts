import { Request, Response } from 'express';
import { FileSecurityService } from '../services/file-security.service';
import { logger } from '../utils/logger';

export class FileUploadController {
  private fileSecurityService: FileSecurityService;

  constructor() {
    this.fileSecurityService = new FileSecurityService();
  }

  async uploadFile(req: Request, res: Response) {
    try {
      const upload = this.fileSecurityService.getUploadMiddleware().single('file');

      upload(req, res, async (err) => {
        if (err) {
          logger.error('File upload error:', err);
          return res.status(400).json({
            success: false,
            error: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'No file uploaded'
          });
        }

        try {
          const filename = await this.fileSecurityService.processUploadedFile(req.file);
          
          res.json({
            success: true,
            filename,
            message: 'File uploaded successfully'
          });
        } catch (error) {
          logger.error('File processing error:', error);
          res.status(500).json({
            success: false,
            error: 'Failed to process uploaded file'
          });
        }
      });
    } catch (error) {
      logger.error('Upload handler error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}