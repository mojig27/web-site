
// frontend/src/components/admin/StatusBadge.tsx
interface StatusBadgeProps {
    type: 'order' | 'payment';
    status: string;
    onClick?: () => void;
  }
  
  export const StatusBadge: React.FC<StatusBadgeProps> = ({
    type,
    status,
    onClick
  }) => {
    const statusConfig = {
      order: {
        processing: {
          color: 'bg-blue-100 text-blue-800',
          label: 'در حال پردازش'
        },
        shipping: {
          color: 'bg-yellow-100 text-yellow-800',
          label: 'در حال ارسال'
        },
        delivered: {
          color: 'bg-green-100 text-green-800',
          label: 'تحویل شده'
        },
        canceled: {
          color: 'bg-red-100 text-red-800',
          label: 'لغو شده'
        }
      },
      payment: {
        pending: {
          color: 'bg-yellow-100 text-yellow-800',
          label: 'در انتظار پرداخت'
        },
        paid: {
          color: 'bg-green-100 text-green-800',
          label: 'پرداخت شده'
        },
        failed: {
          color: 'bg-red-100 text-red-800',
          label: 'ناموفق'
        }
      }
    };
  
    const config = statusConfig[type][status];
  
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm 
          ${config.color} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {config.label}
      </span>
    );
  };