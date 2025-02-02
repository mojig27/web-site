// frontend/src/components/admin/orders/UpdateStatusModal.tsx
import { useState } from 'react';
import { Modal } from '@/components/common/Modal';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onUpdate: (status: string, trackingCode?: string) => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  onUpdate
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [trackingCode, setTrackingCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(status, trackingCode);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تغییر وضعیت سفارش">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وضعیت جدید
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="processing">در حال پردازش</option>
            <option value="shipping">در حال ارسال</option>
            <option value="delivered">تحویل شده</option>
            <option value="canceled">لغو شده</option>
          </select>
        </div>

        {status === 'shipping' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد رهگیری مرسوله
            </label>
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            انصراف
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ثبت تغییرات
          </button>
        </div>
      </form>
    </Modal>
  );
};