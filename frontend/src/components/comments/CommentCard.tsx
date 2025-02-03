// frontend/src/components/comments/CommentCard.tsx
interface CommentCardProps {
    comment: any;
    onReply: () => void;
    onUpdate: (comment: any) => void;
    onDelete: (id: string) => void;
  }
  
  export const CommentCard = ({
    comment,
    onReply,
    onUpdate,
    onDelete
  }: CommentCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [showReplies, setShowReplies] = useState(false);
  
    const handleVote = async (type: 'up' | 'down') => {
      try {
        const response = await commentService.vote(comment._id, type);
        onUpdate(response.data);
      } catch (error) {
        console.error('Error voting:', error);
      }
    };
  
    const handleUpdate = async () => {
      try {
        const response = await commentService.updateComment(
          comment._id,
          editText
        );
        onUpdate(response.data);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    };
  
    const handleDelete = async () => {
      if (window.confirm('آیا از حذف این نظر اطمینان دارید؟')) {
        try {
          await commentService.deleteComment(comment._id);
          onDelete(comment._id);
        } catch (error) {
          console.error('Error deleting comment:', error);
        }
      }
    };
  
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex space-x-4">
          <Avatar src={comment.author.avatar} alt={comment.author.name} />
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{comment.author.name}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleString('fa-IR')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Vote Buttons */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('up')}
                    className={comment.userVote === 'up' ? 'text-green-500' : ''}
                  >
                    ↑ {comment.upvotes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('down')}
                    className={comment.userVote === 'down' ? 'text-red-500' : ''}
                  >
                    ↓ {comment.downvotes}
                  </Button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReply}
                  >
                    پاسخ
                  </Button>
                  {comment.canEdit && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        ویرایش
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                      >
                        حذف
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
  
            {isEditing ? (
              <div className="mt-2">
                <Editor
                  value={editText}
                  onChange={setEditText}
                  mentionable={true}
                  toolbar={['bold', 'italic', 'link', 'emoji']}
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    لغو
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdate}
                  >
                    ذخیره
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-2 prose prose-sm max-w-none">
                {comment.text}
              </div>
            )}
  
            {/* Replies */}
            {comment.replies?.length > 0 && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? 'پنهان کردن' : `نمایش ${comment.replies.length} پاسخ`}
                </Button>
                {showReplies && (
                  <div className="mt-4 space-y-4 pr-8 border-r">
                    {comment.replies.map((reply: any) => (
                      <CommentCard
                        key={reply._id}
                        comment={reply}
                        onReply={onReply}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };