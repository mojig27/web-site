import { Redis } from 'ioredis';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../backend/src/utils/logger';

interface DDOSConfig {
  windowMs: number;           // زمان پنجره (میلی‌ثانیه)
  maxRequestsPerIP: number;   // حداکثر درخواست مجاز در هر پنجره
  banTime: number;           // زمان مسدود شدن IP (میلی‌ثانیه)
  whitelist: string[];       // IP های مجاز
  blacklist: string[];       // IP های مسدود شده
  tokensPerWindow: number;   // تعداد توکن‌های اولیه برای هر IP
  refillRate: number;        // نرخ پر شدن مجدد توکن‌ها (میلی‌ثانیه)
}

export class DDOSProtectionService {
  private redis: Redis;
  private config: DDOSConfig;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });

    this.config = {
      windowMs: 60 * 1000,        // 1 دقیقه
      maxRequestsPerIP: 1000,     // 1000 درخواست در دقیقه
      banTime: 30 * 60 * 1000,    // 30 دقیقه
      whitelist: [],
      blacklist: [],
      tokensPerWindow: 100,
      refillRate: 1000            // 1 ثانیه
    };
  }

  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip;

      try {
        // بررسی IP های مجاز
        if (this.config.whitelist.includes(ip)) {
          return next();
        }

        // بررسی IP های مسدود
        if (await this.isIPBanned(ip)) {
          logger.warn(`Blocked request from banned IP: ${ip}`);
          return res.status(403).json({
            error: 'Your IP has been blocked due to suspicious activity'
          });
        }

        // بررسی نرخ درخواست‌ها
        if (!await this.checkRateLimit(ip)) {
          logger.warn(`Rate limit exceeded for IP: ${ip}`);
          await this.banIP(ip);
          return res.status(429).json({
            error: 'Too many requests, please try again later'
          });
        }

        // بررسی رفتار مشکوک
        if (await this.detectSuspiciousBehavior(req)) {
          logger.warn(`Suspicious behavior detected from IP: ${ip}`);
          await this.banIP(ip);
          return res.status(403).json({
            error: 'Suspicious behavior detected'
          });
        }

        next();
      } catch (error) {
        logger.error('DDOS protection error:', error);
        next(error);
      }
    };
  }

  private async isIPBanned(ip: string): Promise<boolean> {
    const banned = await this.redis.get(`banned:${ip}`);
    return !!banned;
  }

  private async banIP(ip: string): Promise<void> {
    await this.redis.set(
      `banned:${ip}`, 
      '1', 
      'PX', 
      this.config.banTime
    );
    
    // ثبت در لاگ
    logger.warn(`IP banned: ${ip}`);
    
    // اضافه کردن به آمار
    await this.redis.incr('stats:total_bans');
  }

  private async checkRateLimit(ip: string): Promise<boolean> {
    const key = `ratelimit:${ip}`;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // حذف درخواست‌های قدیمی
    await this.redis.zremrangebyscore(key, '-inf', windowStart);

    // شمارش درخواست‌های اخیر
    const requestCount = await this.redis.zcard(key);

    if (requestCount >= this.config.maxRequestsPerIP) {
      return false;
    }

    // ثبت درخواست جدید
    await this.redis.zadd(key, now.toString(), now.toString());
    await this.redis.expire(key, Math.ceil(this.config.windowMs / 1000));

    return true;
  }

  private async detectSuspiciousBehavior(req: Request): Promise<boolean> {
    const ip = req.ip;
    const key = `behavior:${ip}`;
    const now = Date.now();

    // بررسی الگوهای مشکوک
    const patterns = await this.analyzeRequestPatterns(ip, req);
    if (patterns.suspicious) {
      return true;
    }

    // بررسی سرعت درخواست‌ها
    const requestSpeed = await this.analyzeRequestSpeed(ip);
    if (requestSpeed > this.config.maxRequestsPerIP / 10) { // 10٪ از حداکثر نرخ
      return true;
    }

    // بررسی درخواست‌های همزمان
    const concurrentRequests = await this.analyzeConcurrentRequests(ip);
    if (concurrentRequests > 20) { // بیش از 20 درخواست همزمان
      return true;
    }

    return false;
  }

  private async analyzeRequestPatterns(ip: string, req: Request): Promise<{ suspicious: boolean }> {
    const key = `patterns:${ip}`;
    const now = Date.now();
    const windowStart = now - (5 * 60 * 1000); // 5 دقیقه

    // ذخیره اطلاعات درخواست
    await this.redis.zadd(key, now.toString(), JSON.stringify({
      path: req.path,
      method: req.method,
      headers: req.headers,
      timestamp: now
    }));

    // حذف درخواست‌های قدیمی
    await this.redis.zremrangebyscore(key, '-inf', windowStart);

    // دریافت درخواست‌های اخیر
    const recentRequests = await this.redis.zrange(key, 0, -1);
    
    // تحلیل الگوها
    let suspicious = false;
    let samePathCount = 0;
    let sameMethodCount = 0;

    recentRequests.forEach(request => {
      const parsedRequest = JSON.parse(request);
      if (parsedRequest.path === req.path) samePathCount++;
      if (parsedRequest.method === req.method) sameMethodCount++;
    });

    // شناسایی الگوهای مشکوک
    if (samePathCount > 50 || sameMethodCount > 100) {
      suspicious = true;
    }

    return { suspicious };
  }

  private async analyzeRequestSpeed(ip: string): Promise<number> {
    const key = `speed:${ip}`;
    const now = Date.now();
    const oneSecondAgo = now - 1000;

    // حذف درخواست‌های قدیمی‌تر از 1 ثانیه
    await this.redis.zremrangebyscore(key, '-inf', oneSecondAgo);

    // افزودن درخواست جدید
    await this.redis.zadd(key, now.toString(), now.toString());

    // محاسبه تعداد درخواست‌ها در ثانیه
    return await this.redis.zcard(key);
  }

  private async analyzeConcurrentRequests(ip: string): Promise<number> {
    const key = `concurrent:${ip}`;
    const now = Date.now();
    
    // افزایش تعداد درخواست‌های همزمان
    await this.redis.incr(key);
    await this.redis.expire(key, 1); // منقضی شدن بعد از 1 ثانیه

    return parseInt(await this.redis.get(key) || '0');
  }
}