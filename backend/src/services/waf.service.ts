import { Request, Response, NextFunction } from 'express';
import { wafConfig } from '../../../security/waf/waf.config';
import { logger } from '../utils/logger';
import { createHash } from 'crypto';

export class WAFService {
  private requestCache: Map<string, number[]>;

  constructor() {
    this.requestCache = new Map();
    setInterval(() => this.cleanupCache(), 60 * 60 * 1000); // Cleanup every hour
  }

  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Check IP restrictions
        if (!this.checkIPAccess(req.ip)) {
          logger.warn('Blocked request from restricted IP:', req.ip);
          return res.status(403).json({ error: 'Access denied' });
        }

        // Rate limiting
        if (!this.checkRateLimit(req.ip)) {
          logger.warn('Rate limit exceeded for IP:', req.ip);
          return res.status(429).json({ error: wafConfig.rateLimit.message });
        }

        // Request sanitization
        if (wafConfig.sanitization.enabled) {
          this.sanitizeRequest(req);
        }

        // SQL Injection check
        if (wafConfig.sqlInjection.enabled && this.detectSQLInjection(req)) {
          logger.warn('SQL Injection attempt detected:', { ip: req.ip, path: req.path });
          return res.status(403).json({ error: 'Invalid request' });
        }

        // XSS check
        if (wafConfig.xss.enabled && this.detectXSS(req)) {
          logger.warn('XSS attempt detected:', { ip: req.ip, path: req.path });
          return res.status(403).json({ error: 'Invalid request' });
        }

        // Log successful request
        this.logRequest(req);

        next();
      } catch (error) {
        logger.error('WAF error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  }

  private checkIPAccess(ip: string): boolean {
    if (wafConfig.ipFilter.blacklist.includes(ip)) return false;
    if (wafConfig.ipFilter.whitelist.length > 0) {
      return wafConfig.ipFilter.whitelist.includes(ip);
    }
    return true;
  }

  private checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const requests = this.requestCache.get(ip) || [];
    
    // Remove old requests
    const recentRequests = requests.filter(time => 
      time > now - wafConfig.rateLimit.windowMs
    );

    // Check if limit exceeded
    if (recentRequests.length >= wafConfig.rateLimit.max) {
      return false;
    }

    // Add new request
    recentRequests.push(now);
    this.requestCache.set(ip, recentRequests);
    return true;
  }

  private sanitizeRequest(req: Request) {
    wafConfig.sanitization.fields.forEach(field => {
      if (req[field]) {
        this.sanitizeObject(req[field]);
      }
    });
  }

  private sanitizeObject(obj: any) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = this.escapeDangerousChars(obj[key]);
      } else if (typeof obj[key] === 'object') {
        this.sanitizeObject(obj[key]);
      }
    });
  }

  private escapeDangerousChars(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  private detectSQLInjection(req: Request): boolean {
    const checkString = JSON.stringify(req.body) + 
                       JSON.stringify(req.query) + 
                       JSON.stringify(req.params);

    return wafConfig.sqlInjection.patterns.some(pattern => 
      pattern.test(checkString)
    );
  }

  private detectXSS(req: Request): boolean {
    const checkString = JSON.stringify(req.body) + 
                       JSON.stringify(req.query) + 
                       JSON.stringify(req.params);

    return wafConfig.xss.patterns.some(pattern => 
      pattern.test(checkString)
    );
  }

  private logRequest(req: Request) {
    const requestHash = this.generateRequestHash(req);
    logger.info('Request passed WAF:', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      hash: requestHash
    });
  }

  private generateRequestHash(req: Request): string {
    const data = `${req.ip}${req.path}${Date.now()}`;
    return createHash('sha256').update(data).digest('hex');
  }

  private cleanupCache() {
    const now = Date.now();
    for (const [ip, requests] of this.requestCache.entries()) {
      const validRequests = requests.filter(time => 
        time > now - wafConfig.rateLimit.windowMs
      );
      if (validRequests.length === 0) {
        this.requestCache.delete(ip);
      } else {
        this.requestCache.set(ip, validRequests);
      }
    }
  }
}