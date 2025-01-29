import { Client } from '@elastic/elasticsearch';
import { logger } from '../utils/logger';

export class MLAnalysisService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
      }
    });
  }

  async startMLJob(jobId: string) {
    try {
      await this.client.ml.openJob({ job_id: jobId });
      await this.client.ml.startDatafeed({
        datafeed_id: `${jobId}_datafeed`,
        start: 'now-1h'
      });
      logger.info(`Started ML job: ${jobId}`);
    } catch (error) {
      logger.error('Error starting ML job:', error);
      throw error;
    }
  }

  async getAnomalyResults(jobId: string) {
    try {
      const response = await this.client.ml.getBuckets({
        job_id: jobId,
        body: {
          sort: { timestamp: 'desc' },
          size: 100
        }
      });
      return response.body.buckets;
    } catch (error) {
      logger.error('Error getting anomaly results:', error);
      throw error;
    }
  }

  async createCustomAlert(anomaly: any) {
    try {
      await this.client.index({
        index: 'ml-alerts',
        body: {
          timestamp: new Date(),
          anomaly_score: anomaly.anomaly_score,
          description: anomaly.description,
          affected_documents: anomaly.affected_documents
        }
      });
    } catch (error) {
      logger.error('Error creating ML alert:', error);
      throw error;
    }
  }
}