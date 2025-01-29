import promClient from 'prom-client';
import express from 'express';

// متریک‌های کلی
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// متریک‌های سفارشی
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.5, 1, 5]
});

const totalRequests = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});

const activeConnections = new promClient.Gauge({
  name: 'http_active_connections',
  help: 'Number of active connections'
});

export const metricsMiddleware = (app: express.Application) => {
  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.send(metrics);
  });

  // Middleware برای اندازه‌گیری متریک‌ها
  app.use((req, res, next) => {
    const start = Date.now();
    activeConnections.inc();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const route = req.route ? req.route.path : req.path;

      httpRequestDurationMicroseconds
        .labels(req.method, route, res.statusCode.toString())
        .observe(duration / 1000);

      totalRequests
        .labels(req.method, route, res.statusCode.toString())
        .inc();

      activeConnections.dec();
    });

    next();
  });
};