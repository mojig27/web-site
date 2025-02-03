// frontend/src/components/admin/NotificationItem.tsx
interface NotificationItemProps {
    notification: any;
    onRead: (id: string) => void;
    onAction: (notification: any, action: string) => void;
  }
  
  const NotificationItem = ({
    notification,
    onRead,
    onAction
  }: NotificationItemProps) => {
    const getIcon = () => {
      switch (notification.type) {
        case 'content_reported':
          return <Alert className="text-yellow-500" />;
        case 'spam_detected':
          return <XCircle className="text-red-500" />;
        case 'content_approved':
          return <CheckCircle className="text-green-500" />;
        default:
          return null;
      }
    };
  
    const getActions = () => {
      switch (notification.type) {
        case 'content_reported':
          return (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => onAction(notification, 'approve')}
              >
                تایید
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={() => onAction(notification, 'reject')}
              >
                رد
              </Button>
            </>
          );
        case 'spam_detected':
          return (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAction(notification, 'review')}
            >
              بررسی
            </Button>
          );
        default:
          return null;
      }
    };
  
    return (
      <div
        className={`p-4 border-b hover:bg-gray-50 ${
          !notification.read ? 'bg-blue-50' : ''
        }`}
        onClick={() => !notification.read && onRead(notification.id)}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="font-medium">
                {notification.title}
              </p>
              <span className="text-sm text-gray-500">
                {formatDate(notification.created_at)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {notification.message}
            </p>
            {notification.data && (
              <div className="mt-2 text-sm bg-gray-100 rounded p-2">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(notification.data, null, 2)}
                </pre>
              </div>
            )}
            {getActions() && (
              <div className="mt-3 flex space-x-2">
                {getActions()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  