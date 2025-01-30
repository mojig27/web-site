import { Request, Response } from 'express';
import { PerformanceReportService } from '../services/performance-report.service';
import { logger } from '../utils/logger';

export class PerformanceReportController {
  private reportService: PerformanceReportService;

  constructor() {
    this.reportService = new PerformanceReportService();
  }

  async generateReport(req: Request, res: Response) {
    try {
      const testResults = req.body;
      const reportPath = await this.reportService.generateReport(testResults);

      res.json({
        success: true,
        reportPath,
        message: 'Performance report generated successfully'
      });
    } catch (error) {
      logger.error('Failed to generate performance report:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate performance report'
      });
    }
  }
}