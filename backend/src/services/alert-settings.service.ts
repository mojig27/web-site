import { AlertSettings, IAlertSettings } from '../models/alert-settings.model';
import { logger } from '../utils/logger';

export class AlertSettingsService {
  async getSettings(userId: string): Promise<IAlertSettings | null> {
    try {
      return await AlertSettings.findOne({ userId });
    } catch (error) {
      logger.error('Failed to get alert settings:', error);
      throw error;
    }
  }

  async updateSettings(userId: string, settings: Partial<IAlertSettings>): Promise<IAlertSettings> {
    try {
      const existingSettings = await AlertSettings.findOne({ userId });

      if (existingSettings) {
        Object.assign(existingSettings, settings);
        return await existingSettings.save();
      }

      return await AlertSettings.create({
        userId,
        ...settings
      });
    } catch (error) {
      logger.error('Failed to update alert settings:', error);
      throw error;
    }
  }

  async testNotificationChannel(userId: string, channelType: string): Promise<boolean> {
    try {
      const settings = await this.getSettings(userId);
      if (!settings) throw new Error('Settings not found');

      const channel = settings.notificationChannels.find(c => c.type === channelType);
      if (!channel) throw new Error('Channel not found');

      // Send test notification
      const testMessage = {
        title: 'Test Notification',
        message: 'This is a test notification to verify your settings.',
        severity: 'info'
      };

      // Implementation depends on your notification service
      // await notificationService.sendToChannel(channel, testMessage);

      return true;
    } catch (error) {
      logger.error('Failed to test notification channel:', error);
      throw error;
    }
  }
}