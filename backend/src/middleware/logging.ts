import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // لاگ درخواست
  logger.info('Request received', {
    type: 'access',
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // لاگ پاسخ
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Response sent', {
      type: 'access',
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      contentLength: res.get('content-length')
    });
  });

  next();
};