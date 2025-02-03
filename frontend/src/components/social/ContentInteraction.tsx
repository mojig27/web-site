// frontend/src/components/social/ContentInteraction.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { interactionService } from '@/services/interaction.service';

interface ContentInteractionProps {
  contentId: string;
  initialData?: {
    likes: number;
    bookmarks: number;
    shares: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
}

export const ContentInteraction = ({
  contentId,
  initialData
}: ContentInteractionProps) => {
  const [stats, setStats] = useState(initialData || {
    likes: 0,
    bookmarks: 0,
    shares: 0,
    isLiked: false,
    isBookmarked: false
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchStats();
  }, [contentId]);

  const fetchStats = async () => {
    try {
      const response = await interactionService.getStats(contentId);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await interactionService.toggleLike(contentId);
      setStats(prev => ({
        ...prev,
        likes: response.data.likes,
        isLiked: response.data.isLiked
      }));
      setToastMessage(response.data.isLiked ? 'به لیست علاقه‌مندی‌ها اضافه شد' : 'از لیست علاقه‌مندی‌ها حذف شد');
    } catch (error) {
      setToastMessage('خطا در ثبت لایک');
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await interactionService.toggleBookmark(contentId);
      setStats(prev => ({
        ...prev,
        bookmarks: response.data.bookmarks,
        isBookmarked: response.data.isBookmarked
      }));
      setToastMessage(response.data.isBookmarked ? 'ذخیره شد' : 'از نشانک‌ها حذف شد');
    } catch (error) {
      setToastMessage('خطا در ذخیره‌سازی');
    }
  };

  const handleShare = async (platform: string) => {
    try {
      await interactionService.share(contentId, platform);
      setStats(prev => ({
        ...prev,
        shares: prev.shares + 1
      }));
      setShareModalOpen(false);
      setToastMessage('با موفقیت به اشتراک گذاشته شد');
    } catch (error) {
      setToastMessage('خطا در اشتراک‌گذاری');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Like Button */}
      <Button
        variant={stats.isLiked ? 'primary' : 'secondary'}
        onClick={handleLike}
        className="flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {/* Heart Icon */}
        </svg>
        <span>{stats.likes}</span>
      </Button>

      {/* Bookmark Button */}
      <Button
        variant={stats.isBookmarked ? 'primary' : 'secondary'}
        onClick={handleBookmark}
        className="flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {/* Bookmark Icon */}
        </svg>
        <span>{stats.bookmarks}</span>
      </Button>

      {/* Share Button */}
      <Button
        variant="secondary"
        onClick={() => setShareModalOpen(true)}
        className="flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {/* Share Icon */}
        </svg>
        <span>{stats.shares}</span>
      </Button>

      {/* Share Modal */}
      <Modal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="اشتراک‌گذاری"
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'telegram', label: 'تلگرام', icon: 'telegram-icon' },
            { id: 'whatsapp', label: 'واتساپ', icon: 'whatsapp-icon' },
            { id: 'twitter', label: 'توییتر', icon: 'twitter-icon' },
            { id: 'linkedin', label: 'لینکدین', icon: 'linkedin-icon' },
            { id: 'email', label: 'ایمیل', icon: 'email-icon' },
            { id: 'copy', label: 'کپی لینک', icon: 'copy-icon' }
          ].map(platform => (
            <Button
              key={platform.id}
              variant="secondary"
              onClick={() => handleShare(platform.id)}
              className="flex items-center justify-center space-x-2 p-4"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                {/* Platform Icon */}
              </svg>
              <span>{platform.label}</span>
            </Button>
          ))}
        </div>
      </Modal>

      {/* Toast Notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
          type="success"
        />
      )}
    </div>
  );
};

