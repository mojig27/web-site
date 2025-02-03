// frontend/src/components/comments/CommentSection.tsx
import { useState, useEffect } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Editor } from '@/components/ui/Editor';
import { commentService } from '@/services/comment.service';

interface CommentSectionProps {
  contentId: string;
  type: 'post' | 'product' | 'page';
}

export const CommentSection = ({ contentId, type }: CommentSectionProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [contentId, sortBy]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentService.getComments(contentId, {
        sort: sortBy,
        include_replies: true
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    try {
      const response = await commentService.createComment({
        content: contentId,
        type,
        text: newComment,
        parent_id: replyTo
      });

      setComments(prev => {
        if (replyTo) {
          return prev.map(comment => {
            if (comment._id === replyTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response.data]
              };
            }
            return comment;
          });
        }
        return [response.data, ...prev];
      });

      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          نظرات ({comments.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
          className="border rounded-lg px-3 py-2"
        >
          <option value="newest">جدیدترین</option>
          <option value="popular">محبوب‌ترین</option>
        </select>
      </div>

      {/* New Comment Form */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex space-x-4">
          <Avatar src="/default-avatar.png" alt="Your avatar" />
          <div className="flex-1">
            <Editor
              value={newComment}
              onChange={setNewComment}
              placeholder={
                replyTo 
                  ? "پاسخ خود را بنویسید..."
                  : "نظر خود را بنویسید..."
              }
              mentionable={true}
              toolbar={['bold', 'italic', 'link', 'emoji']}
            />
            <div className="flex justify-end mt-4 space-x-2">
              {replyTo && (
                <Button
                  variant="secondary"
                  onClick={() => setReplyTo(null)}
                >
                  لغو پاسخ
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                {replyTo ? 'ارسال پاسخ' : 'ارسال نظر'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <CommentSkeleton count={3} />
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onReply={() => setReplyTo(comment._id)}
              onUpdate={(updatedComment) => {
                setComments(prev =>
                  prev.map(c =>
                    c._id === updatedComment._id ? updatedComment : c
                  )
                );
              }}
              onDelete={(commentId) => {
                setComments(prev =>
                  prev.filter(c => c._id !== commentId)
                );
              }}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            هنوز نظری ثبت نشده است. اولین نظر را شما ثبت کنید!
          </div>
        )}
      </div>
    </div>
  );
};

