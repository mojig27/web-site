import { NotificationService } from './notification.service';
import { logger } from '../utils/logger';

interface PerformanceThresholds {
  cpu: number;
  memory: number;
  responseTime: number;
  errorRate: number;
}

export class PerformanceMonitorService {
  private notificationService: NotificationService;
  private thresholds: PerformanceThresholds;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.notificationService = new NotificationService();
    this.thresholds = {
      cpu: 80, // 80%
      memory: 85, // 85%
      responseTime: 1000, // 1 second
      errorRate: 5 // 5%
    };
  }

  startMonitoring() {
    this.checkInterval = setInterval(async () => {
      await this.checkPerformanceMetrics();
    }, 60000); // هر دقیقه چک می‌کند
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private async checkPerformanceMetrics() {
    try {
      const metrics = await this.collectMetrics();
      const issues = this.analyzeMetrics(metrics);

      if (issues.length > 0) {
        await this.notificationService.sendAlert({
          title: 'Performance Issues Detected',
          message: 'The following performance issues have been detected:',
          severity: this.determineSeverity(issues),
          metrics: issues.map(issue => ({
            name: issue.metric,
            value: issue.value,
            threshold: issue.threshold
          }))
        });
      }
    } catch (error) {
      logger.error('Failed to check performance metrics:', error);
    }
  }

  private async collectMetrics() {
    // CPU Usage
    const cpuUsage = await this.getCPUUsage();
    
    // Memory Usage
    const memoryUsage = await this.getMemoryUsage();
    
    // Response Time (avg last minute)
    const responseTime = await this.getAverageResponseTime();
    
    // Error Rate
    const errorRate = await this.getErrorRate();

    return {
      cpu: cpuUsage,
      memory: memoryUsage,
      responseTime,
      errorRate
    };
  }

  private analyzeMetrics(metrics: any) {
    const issues = [];

    if (metrics.cpu > this.thresholds.cpu) {
      issues.push({
        metric: 'CPU Usage',
        value: metrics.cpu,
        threshold: this.thresholds.cpu
      });
    }

    if (metrics.memory > this.thresholds.memory) {
      issues.push({
        metric: 'Memory Usage',
        value: metrics.memory,
        threshold: this.thresholds.memory
      });
    }

    if (metrics.responseTime > this.thresholds.responseTime) {
      issues.push({
        metric: 'Response Time',
        value: metrics.responseTime,
        threshold: this.thresholds.responseTime
      });
    }

    if (metrics.errorRate > this.thresholds.errorRate) {
      issues.push({
        metric: 'Error Rate',
        value: metrics.errorRate,
        threshold: this.thresholds.errorRate
      });
    }

    return issues;
  }

  private determineSeverity(issues: any[]): 'info' | 'warning' | 'critical' {
    if (issues.length >= 3) return 'critical';
    if (issues.length >= 1) return 'warning';
    return 'info';
  }

  // Utility methods for collecting specific metrics
  private async getCPUUsage(): Promise<number> {
    // Implementation for getting CPU usage
    return process.cpuUsage().user / 1000000;
  }

  private async getMemoryUsage(): Promise<number> {
    const used = process.memoryUsage().heapUsed;
    const total = process.memoryUsage().heapTotal;
    return (used / total) * 100;
  }

  private async getAverageResponseTime(): Promise<number> {
    // Implementation for getting average response time
    // This could come from your metrics storage (e.g., Prometheus)
    return 0;
  }

  private async getErrorRate(): Promise<number> {
    // Implementation for getting error rate
    // This could come from your metrics storage
    return 0;
  }
}