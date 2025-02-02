
// backend/src/services/report.service.ts
import { ContentModel } from '../models/content.model';
import { UserModel } from '../models/user.model';
import { AnalyticsModel } from '../models/analytics.model';
import { Redis } from '../config/redis';

export class ReportService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async generateReport(config: any) {
    const cacheKey = `report:${JSON.stringify(config)}`;
    const cachedReport = await this.redis.get(cacheKey);
    
    if (cachedReport) {
      return JSON.parse(cachedReport);
    }

    const {
      type,
      metrics,
      dateRange,
      groupBy,
      filters
    } = config;

    const pipeline: any[] = [
      // Match date range
      {
        $match: {
          timestamp: {
            $gte: new Date(dateRange.start),
            $lte: new Date(dateRange.end)
          }
        }
      }
    ];

    // Add filters
    if (filters) {
      pipeline.push({ $match: filters });
    }

    // Group by time period
    const groupByConfig = this.getGroupByConfig(groupBy);
    pipeline.push({
      $group: {
        _id: groupByConfig,
        ...this.buildMetricsAggregation(metrics)
      }
    });

    // Sort by time
    pipeline.push({ $sort: { '_id': 1 } });

    const results = await AnalyticsModel.aggregate(pipeline);

    // Transform results
    const report = {
      summary: this.calculateSummary(results, metrics),
      chart: this.transformForChart(results),
      details: this.transformForTable(results)
    };

    // Cache report
    await this.redis.setex(cacheKey, 3600, JSON.stringify(report));

    return report;
  }

  private getGroupByConfig(groupBy: string) {
    switch (groupBy) {
      case 'hour':
        return {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          hour: { $hour: '$timestamp' }
        };
      case 'day':
        return {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        };
      case 'week':
        return {
          year: { $year: '$timestamp' },
          week: { $week: '$timestamp' }
        };
      case 'month':
        return {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' }
        };
      default:
        throw new Error('Invalid groupBy parameter');
    }
  }

  private buildMetricsAggregation(metrics: string[]) {
    const aggregations: any = {};
    
    metrics.forEach(metric => {
      switch (metric) {
        case 'views':
          aggregations[metric] = { $sum: '$views' };
          break;
        case 'visitors':
          aggregations[metric] = { $addToSet: '$visitor_id' };
          break;
        case 'avgTime':
          aggregations[metric] = { $avg: '$time_spent' };
          break;
        case 'shares':
          aggregations[metric] = { $sum: '$shares' };
          break;
      }
    });

    return aggregations;
  }

  private calculateSummary(results: any[], metrics: string[]) {
    const summary: any = {};

    metrics.forEach(metric => {
      switch (metric) {
        case 'views':
        case 'shares':
          summary[metric] = results.reduce((sum, row) => sum + row[metric], 0);
          break;
        case 'visitors':
          summary[metric] = new Set(
            results.flatMap(row => row[metric])
          ).size;
          break;
        case 'avgTime':
          summary[metric] = results.reduce((sum, row) => sum + row[metric], 0) / results.length;
          break;
      }
    });

    return summary;
  }

  private transformForChart(results: any[]) {
    return results.map(row => ({
      timestamp: this.getTimestampFromId(row._id),
      ...row
    }));
  }

  private transformForTable(results: any[]) {
    return results.map(row => ({
      date: this.getTimestampFromId(row._id),
      ...row
    }));
  }

  private getTimestampFromId(id: any) {
    const date = new Date();
    if (id.year) date.setFullYear(id.year);
    if (id.month) date.setMonth(id.month - 1);
    if (id.day) date.setDate(id.day);
    if (id.hour) date.setHours(id.hour);
    return date.getTime();
  }
}