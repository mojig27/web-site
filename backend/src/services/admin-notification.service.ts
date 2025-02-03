
// backend/src/services/admin-notification.service.ts
export class AdminNotificationService {
    private websocketServer: any;
    private redis: Redis;
  
    constructor(ws: any) {
      this.websocketServer = ws;
      this.redis = new Redis();
    }
  
    async createNotification(data: {
      type: string;
      title: string;
      message: string;
      data?: any;
      priority?: 'low' | 'medium' | 'high';
    }) {
      const notification = {
        id: uuid(),
        ...data,
        read: false,
        created_at: new Date()
      };
  
      // ذخیره در دیتابیس
      await this.saveNotification(notification);
  
      // ارسال به مدیران آنلاین
      this.broadcastToAdmins(notification);
  
      // ارسال ایمیل برای نوتیفیکیشن‌های مهم
      if (data.priority === 'high') {
        await this.sendEmailToAdmins(notification);
      }
  
      return notification;
    }
  
    private async saveNotification(notification: any) {
      const key = `admin:notifications:${notification.id}`;
      await this.redis.setex(key, 86400 * 7, JSON.stringify(notification));
      
      // اضافه کردن به لیست نوتیفیکیشن‌های اخیر
      await this.redis.lpush('admin:notifications:recent', notification.id);
      await this.redis.ltrim('admin:notifications:recent', 0, 99);
    }
  
    private broadcastToAdmins(notification: any) {
      const message = JSON.stringify({
        type: 'admin_notification',
        notification
      });
  
      this.websocketServer.clients.forEach((client: any) => {
        if (client.isAdmin && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  
    private async sendEmailToAdmins(notification: any) {
      const admins = await UserModel.find({ role: 'admin' })
        .select('email notifications_settings');
  
      for (const admin of admins) {
        if (admin.notifications_settings?.email?.[notification.type]) {
          await emailService.sendAdminNotification(
            admin.email,
            notification
          );
        }
      }
    }
  }