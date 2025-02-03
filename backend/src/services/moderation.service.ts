// backend/src/services/moderation.service.ts
export class ModerationService {
    private spamDetector: SpamDetectionService;
    private contentFilter: ContentFilterService;
    private notificationService: NotificationService;
  
    constructor() {
      this.spamDetector = new SpamDetectionService();
      this.contentFilter = new ContentFilterService();
      this.notificationService = new NotificationService();
    }
  
    async checkSpam(text: string, context: {
      userId: string;
      ip: string;
    }): Promise<boolean> {
      // Rate limiting
      const userRate = await this.getRateLimit(context.userId);
      const ipRate = await this.getRateLimit(context.ip);
  
      if (userRate > 10 || ipRate > 5) {
        return true;
      }
  
      // Content-based spam detection
      const spamScore = await this.spamDetector.analyze(text, context);
      return spamScore > 0.8;
    }
  
    async checkContent(text: string): Promise<{
      approved: boolean;
      reason?: string;
    }> {
      const result = await this.contentFilter.analyze(text);
  
      return {
        approved: result.score < 0.5,
        reason: result.score >= 0.5 ? result.reason : undefined
      };
    }
  
    async updateCommentStatus(
      commentId: string,
      status: 'approved' | 'rejected',
      moderatorId: string
    ) {
      const comment = await CommentModel.findById(commentId);
      
      if (!comment) {
        throw new APIError('Comment not found', 404);
      }
  
      comment.status = status;
      comment.moderation = {
        moderator: moderatorId,
        timestamp: new Date(),
        reason: status === 'rejected' ? 'Violates community guidelines' : undefined
      };
  
      await comment.save();
  
      // Notify user
      await this.notificationService.createNotification({
        type: `comment_${status}`,
        user: comment.author,
        content: comment.content,
        data: { commentId }
      });
  
      return comment;
    }
  
    async handleReport(commentId: string, userId: string, reason: string) {
      const comment = await CommentModel.findById(commentId);
      
      if (!comment) {
        throw new APIError('Comment not found', 404);
      }
  
      // Check if user already reported
      if (comment.reports.some(report => report.user.toString() === userId)) {
        throw new APIError('Already reported', 400);
      }
  
      comment.reports.push({
        user: userId,
        reason,
        created_at: new Date()
      });
  
      // Auto-hide comment if it gets too many reports
      if (comment.reports.length >= 5 && comment.status === 'approved') {
        comment.status = 'pending';
        
        // Notify moderators
        await this.notificationService.notifyModerators({
          type: 'comment_reported',
          content: comment.content,
          data: { commentId, reportCount: comment.reports.length }
        });
      }
  
      await comment.save();
      return comment;
    }
  
    private async getRateLimit(key: string): Promise<number> {
      // Implement rate limiting logic
      return 0;
    }
  }