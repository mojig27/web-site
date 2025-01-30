import WebSocket from 'ws';
import { Server } from 'http';
import { logger } from '../utils/logger';

export class PerformanceWebSocket {
  private wss: WebSocket.Server;

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws) => {
      logger.info('New client connected to performance websocket');

      ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
      });

      ws.on('close', () => {
        logger.info('Client disconnected from performance websocket');
      });
    });
  }

  broadcastMetrics(metrics: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(metrics));
      }
    });
  }
}