import { WebClient } from '@slack/web-api';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface NotificationPayload {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  metrics?: {
    name: string;
    value: number;
    threshold: number;
  }[];
}

export class NotificationService {
  private slackClient: WebClient;
  private emailTransporter: nodemailer.Transporter;

  constructor() {
    // Slack setup
    this.slackClient = new WebClient(process.env.SLACK_TOKEN);

    // Email setup
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendAlert(payload: NotificationPayload) {
    try {
      await Promise.all([
        this.sendSlackNotification(payload),
        this.sendEmailNotification(payload),
        this.sendWebhook(payload)
      ]);

      logger.info('Alert notifications sent successfully', { payload });
    } catch (error) {
      logger.error('Failed to send alert notifications:', error);
      throw error;
    }
  }

  private async sendSlackNotification(payload: NotificationPayload) {
    const color = this.getSeverityColor(payload.severity);
    const metricsText = payload.metrics?.map(m => 
      `• ${m.name}: ${m.value} (threshold: ${m.threshold})`
    ).join('\n');

    await this.slackClient.chat.postMessage({
      channel: process.env.SLACK_CHANNEL || '#alerts',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚨 ${payload.title}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: payload.message
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Metrics:*\n${metricsText}`
          }
        }
      ],
      attachments: [{
        color: color
      }]
    });
  }

  private async sendEmailNotification(payload: NotificationPayload) {
    const metricsHtml = payload.metrics?.map(m => 
      `<li>${m.name}: ${m.value} (threshold: ${m.threshold})</li>`
    ).join('');

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: ${this.getSeverityColor(payload.severity)}">
          ${payload.title}
        </h2>
        <p>${payload.message}</p>
        ${payload.metrics ? `
          <h3>Metrics:</h3>
          <ul>${metricsHtml}</ul>
        ` : ''}
        <p style="color: gray; font-size: 12px;">
          Sent at: ${new Date().toISOString()}
        </p>
      </div>
    `;

    await this.emailTransporter.sendMail({
      from: process.env.ALERT_EMAIL_FROM,
      to: process.env.ALERT_EMAIL_TO,
      subject: `[${payload.severity.toUpperCase()}] ${payload.title}`,
      html
    });
  }

  private async sendWebhook(payload: NotificationPayload) {
    if (!process.env.WEBHOOK_URL) return;

    await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...payload
      })
    });
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical':
        return '#ff0000';
      case 'warning':
        return '#ffa500';
      default:
        return '#36a64f';
    }
  }
}