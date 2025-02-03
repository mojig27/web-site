// frontend/src/components/admin/CommentModeration.tsx
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { moderationService } from '@/services/moderation.service';
import { toast } from '@/components/ui/Toast';

export const CommentModeration = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: 'pending',
    date_range: 'today',
    reported: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [filters]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await moderationService.getComments(filters);
      setComments(response.data);
    } catch (error) {
      toast.error('خطا در دریافت نظرات');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (commentId: string, status: string) => {
    try {
      await moderationService.updateCommentStatus(commentId, status);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('وضعیت نظر با موفقیت تغییر کرد');
    } catch (error) {
      toast.error('خطا در تغییر وضعیت نظر');
    }
  };

  const columns = [
    {
      title: 'متن نظر',
      key: 'text',
      render: (text: string) => (
        <div className="max-w-md">
          <p className="truncate">{text}</p>
        </div>
      )
    },
    {
      title: 'نویسنده',
      key: 'author',
      render: (author: any) => (
        <div className="flex items-center space-x-2">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-8 h-8 rounded-full"
          />
          <span>{author.name}</span>
        </div>
      )
    },
    {
      title: 'محتوا',
      key: 'content',
      render: (content: any) => (
        <a
          href={`/content/${content._id}`}
          className="text-blue-600 hover:underline"
          target="_blank"
        >
          {content.title}
        </a>
      )
    },
    {
      title: 'تاریخ',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString('fa-IR')
    },
    {
      title: 'وضعیت',
      key: 'status',
      render: (status: string) => (
        <Badge
          variant={
            status === 'approved' ? 'success' :
            status === 'rejected' ? 'error' :
            'warning'
          }
        >
          {
            status === 'approved' ? 'تایید شده' :
            status === 'rejected' ? 'رد شده' :
            'در انتظار بررسی'
          }
        </Badge>
      )
    },
    {
      title: 'گزارش‌ها',
      key: 'reports',
      render: (reports: any[]) => reports.length > 0 && (
        <Badge variant="error">
          {reports.length} گزارش
        </Badge>
      )
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_, comment: any) => (
        <div className="flex space-x-2">
          <Button
            variant="success"
            size="sm"
            onClick={() => handleStatusChange(comment._id, 'approved')}
            disabled={comment.status === 'approved'}
          >
            تایید
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleStatusChange(comment._id, 'rejected')}
            disabled={comment.status === 'rejected'}
          >
            رد
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedComment(comment)}
          >
            جزئیات
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            status: e.target.value
          }))}
          className="rounded-lg border-gray-300"
        >
          <option value="pending">در انتظار بررسی</option>
          <option value="approved">تایید شده</option>
          <option value="rejected">رد شده</option>
        </select>

        <select
          value={filters.date_range}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            date_range: e.target.value
          }))}
          className="rounded-lg border-gray-300"
        >
          <option value="today">امروز</option>
          <option value="week">این هفته</option>
          <option value="month">این ماه</option>
        </select>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.reported}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              reported: e.target.checked
            }))}
            className="rounded border-gray-300 mr-2"
          />
          فقط گزارش شده
        </label>
      </div>

      {/* Comments Table */}
      <DataTable
        columns={columns}
        data={comments}
        loading={loading}
        pagination={{
          total: comments.length,
          pageSize: 10
        }}
      />

      {/* Comment Details Modal */}
      {selectedComment && (
        <CommentDetailsModal
          comment={selectedComment}
          onClose={() => setSelectedComment(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

