import { writeFile } from 'fs/promises';
import { join } from 'path';
import { logger } from '../utils/logger';

interface PerformanceMetric {
  timestamp: string;
  type: string;
  value: number;
  threshold: number;
  status: 'success' | 'warning' | 'error';
}

interface TestResult {
  testName: string;
  startTime: string;
  endTime: string;
  metrics: PerformanceMetric[];
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    avgResponseTime: number;
  };
}

export class PerformanceReportService {
  private reportsDir: string;

  constructor() {
    this.reportsDir = join(process.cwd(), 'reports', 'performance');
  }

  async generateReport(testResults: TestResult[]): Promise<string> {
    try {
      const report = {
        generatedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        summary: this.generateSummary(testResults),
        details: testResults,
        recommendations: this.generateRecommendations(testResults)
      };

      const fileName = `performance-report-${Date.now()}.json`;
      const filePath = join(this.reportsDir, fileName);
      
      await writeFile(filePath, JSON.stringify(report, null, 2));
      await this.generateHtmlReport(report, filePath.replace('.json', '.html'));

      return filePath;
    } catch (error) {
      logger.error('Failed to generate performance report:', error);
      throw error;
    }
  }

  private generateSummary(results: TestResult[]) {
    const totalTests = results.reduce((sum, result) => sum + result.summary.totalTests, 0);
    const totalPassed = results.reduce((sum, result) => sum + result.summary.passed, 0);
    const avgResponseTime = results.reduce((sum, result) => sum + result.summary.avgResponseTime, 0) / results.length;

    return {
      totalTests,
      passRate: (totalPassed / totalTests) * 100,
      avgResponseTime,
      criticalIssues: this.identifyCriticalIssues(results)
    };
  }

  private identifyCriticalIssues(results: TestResult[]) {
    return results
      .flatMap(result => result.metrics)
      .filter(metric => metric.status === 'error')
      .map(metric => ({
        type: metric.type,
        value: metric.value,
        threshold: metric.threshold,
        timestamp: metric.timestamp
      }));
  }

  private generateRecommendations(results: TestResult[]) {
    const issues = new Set<string>();
    
    results.forEach(result => {
      result.metrics.forEach(metric => {
        if (metric.status === 'error' || metric.status === 'warning') {
          switch (metric.type) {
            case 'LCP':
              issues.add('Consider implementing lazy loading and optimizing largest contentful paint');
              break;
            case 'FID':
              issues.add('Optimize JavaScript execution and reduce main thread blocking');
              break;
            case 'CLS':
              issues.add('Improve layout stability by reserving space for dynamic content');
              break;
            case 'TTFB':
              issues.add('Optimize server response time and implement caching strategies');
              break;
          }
        }
      });
    });

    return Array.from(issues);
  }

  private async generateHtmlReport(report: any, filePath: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Performance Test Report</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body class="bg-gray-50 p-8">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-3xl font-bold mb-8">Performance Test Report</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4">Summary</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-gray-600">Total Tests</p>
                    <p class="text-2xl font-bold">${report.summary.totalTests}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Pass Rate</p>
                    <p class="text-2xl font-bold">${report.summary.passRate.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4">Response Time</h2>
                <canvas id="responseTimeChart"></canvas>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow mb-8">
              <h2 class="text-xl font-semibold mb-4">Recommendations</h2>
              <ul class="list-disc pl-5">
                ${report.recommendations.map(rec => `<li class="mb-2">${rec}</li>`).join('')}
              </ul>
            </div>
          </div>

          <script>
            const ctx = document.getElementById('responseTimeChart').getContext('2d');
            new Chart(ctx, {
              type: 'line',
              data: {
                labels: ${JSON.stringify(report.details.map(r => r.startTime))},
                datasets: [{
                  label: 'Response Time (ms)',
                  data: ${JSON.stringify(report.details.map(r => r.summary.avgResponseTime))},
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              }
            });
          </script>
        </body>
      </html>
    `;

    await writeFile(filePath, html);
  }
}