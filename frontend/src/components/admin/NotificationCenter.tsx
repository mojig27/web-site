// frontend/src/components/admin/NotificationCenter.tsx
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Bell, Alert, CheckCircle, XCircle } from '@/components/icons';
import { notificationService } from '@/services/notification.service';

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    initializeWebSocket();
  }, []);

  const fetchNotifications = async () => {
    const response = await notificationService.getAdminNotifications();
    setNotifications(response.data);
    setUnreadCount(response.data.filter((n: any) => !n.read).length);
  };

  const initializeWebSocket = () => {
    const ws = new WebSocket(config.WS_URL);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'admin_notification') {
        addNotification(data.notification);
      }
    };

    return () => ws.close();
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    showDesktopNotification(notification);
  };

  const showDesktopNotification = (notification: any) => {
    if (Notification.permission === 'granted') {
      new Notification('مدیریت محتوا', {
        body: notification.message,
        icon: '/admin-notification-icon.png'
      });
    }
  };

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => prev - 1);
  };

  const handleAction = async (notification: any, action: string) => {
    try {
      await notificationService.handleAction(notification.id, action);
      // بروزرسانی وضعیت نوتیفیکیشن
      fetchNotifications();
    } catch (error) {
      toast.error('خطا در انجام عملیات');
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <Badge
            variant="error"
            className="absolute -top-1 -right-1 min-w-[1.25rem]"
          >
            {unreadCount}
          </Badge>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">اعلان‌های مدیریت</h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onAction={handleAction}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                اعلان جدیدی وجود ندارد
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

