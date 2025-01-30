import { Redis } from 'ioredis';
import { EventEmitter } from 'events';
import { logger } from '../../backend/src/utils/logger';

interface DDOSMetrics {
  totalRequests: number;
  bannedIPs: number;
  activeConnections: number;
  requestRate: number;
  suspiciousActivities: number;
}

export class DDOSMonitorService extends EventEmitter {
  private redis: Redis;
  private metricsInterval: NodeJS.Timer;

  constructor() {
    super();
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });

    this.startMetricsCollection();
  }

  private startMetricsCollection() {
    this.metricsInterval = setInterval(async () => {
      try {
        const metrics = await this.collectMetrics();
        this.emit('metrics', metrics);

        // تحلیل وضعیت و هشدار در صورت نیاز
        await this.analyzeMetrics(metrics);
      } catch (error) {
        logger.error('Error collecting DDOS metrics:', error);
      }
    }, 5000); // هر 5 ثانیه
  }

  private async collectMetrics(): Promise<DDOSMetrics> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // جمع‌آوری آمار
    const [
      totalRequests,
      bannedIPs,
      activeConnections,
      recentRequests,
      suspiciousActivities
    ] = await Promise.all([
      this.redis.get('stats:total_requests') || '0',
      this.redis.scard('banned_ips'),
      this.redis.scard('active_connections'),
      this.redis.zcount('recent_requests', oneMinuteAgo, '+inf'),
      this.redis.get('stats:suspicious_activities') || '0'
    ]);

    return {
      totalRequests: parseInt(totalRequests),
      bannedIPs: parseInt(bannedIPs.toString()),
      activeConnections: parseInt(activeConnections.toString()),
      requestRate: recentRequests,
      suspiciousActivities: parseInt(suspiciousActivities)
    };
  }

  private async analyzeMetrics(metrics: DDOSMetrics) {
    // تحلیل نرخ درخواست‌ها
    if (metrics.requestRate > 10000) { // بیش از 10000 درخواست در دقیقه
      this.emit('alert', {
        type: 'high_traffic',
        message: `High traffic detected: ${metrics.requestRate} requests/minute`,
        severity: 'critical'
      });
    }

    // تحلیل تعداد IP های مسدود شده
    if (metrics.bannedIPs > 1000) {
      this.emit('alert', {
        type: 'many_bans',
        message: `High number of banned IPs: ${metrics.bannedIPs}`,
        severity: 'warning'
      });
    }

    // تحلیل فعالیت‌های مشکوک
    if (metrics.suspiciousActivities > 100) {
      this.emit('alert', {
        type: 'suspicious_activity',
        message: `High number of suspicious activities: ${metrics.suspiciousActivities}`,
        severity: 'warning'
      });
    }

    // ذخیره آمار برای تحلیل‌های بعدی
    await this.storeMetricsHistory(metrics);
  }

  private async storeMetricsHistory(metrics: DDOSMetrics) {
    const now = Date.now();
    await this.redis.zadd('metrics_history', now, JSON.stringify({
      ...metrics,
      timestamp: now
    }));

    // نگهداری فقط 24 ساعت آخر
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    await this.redis.zremrangebyscore('metrics_history', '-inf', oneDayAgo);
  }

  async getMetricsHistory(duration: number = 3600000): Promise<any[]> {
    const now = Date.now();
    const start = now - duration;
    const data = await this.redis.zrangebyscore('metrics_history', start, now);
    return data.map(item => JSON.parse(item));
  }

  stop() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }
}