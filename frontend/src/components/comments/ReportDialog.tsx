// frontend/src/components/comments/ReportDialog.tsx
import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Radio } from '@/components/ui/Radio';
import { Textarea } from '@/components/ui/Textarea';
import { moderationService } from '@/services/moderation.service';

interface ReportDialogProps {
  commentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportDialog = ({ commentId, isOpen, onClose }: ReportDialogProps) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const reportReasons = [
    { value: 'spam', label: 'محتوای اسپم' },
    { value: 'inappropriate', label: 'محتوای نامناسب' },
    { value: 'harassment', label: 'آزار و اذیت' },
    { value: 'hate_speech', label: 'نفرت‌پراکنی' },
    { value: 'misinformation', label: 'اطلاعات نادرست' },
    { value: 'other', label: 'سایر موارد' }
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await moderationService.reportComment(commentId, {
        reason,
        description
      });
      toast.success('گزارش شما با موفقیت ثبت شد');
      onClose();
    } catch (error) {
      toast.error('خطا در ثبت گزارش');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="گزارش نظر نامناسب"
      className="max-w-md"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block font-medium">دلیل گزارش:</label>
          <div className="space-y-2">
            {reportReasons.map((option) => (
              <Radio
                key={option.value}
                name="report_reason"
                value={option.value}
                checked={reason === option.value}
                onChange={(e) => setReason(e.target.value)}
                label={option.label}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">توضیحات (اختیاری):</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحات خود را وارد کنید..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            انصراف
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!reason}
          >
            ثبت گزارش
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

