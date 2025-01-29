import { Request, Response } from 'express';
import { MLAnalysisService } from '../services/ml-analysis.service';

export class MLController {
  private mlService: MLAnalysisService;

  constructor() {
    this.mlService = new MLAnalysisService();
  }

  async getAnomalies(req: Request, res: Response) {
    try {
      const anomalies = await this.mlService.getAnomalyResults('web_traffic_anomalies');
      res.json({
        success: true,
        data: anomalies
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch anomalies'
      });
    }
  }

  async startAnalysis(req: Request, res: Response) {
    try {
      await this.mlService.startMLJob('web_traffic_anomalies');
      res.json({
        success: true,
        message: 'ML analysis started successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to start ML analysis'
      });
    }
  }
}