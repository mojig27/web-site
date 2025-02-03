// backend/src/services/comment.service.ts
import { CommentModel, IComment } from '../models/comment.model';
import { NotificationService } from './notification.service';
import { ModerationService } from './moderation.service';
import { CacheService } from './cache.service';
import { UserService } from './user.service';
import { APIError } from '../utils/errors';

export class CommentService {
  private notificationService: NotificationService;
  private moderationService: ModerationService;
  private cacheService: CacheService;
  private userService: UserService;

  constructor() {
    this.notificationService = new NotificationService();
    this.moderationService = new ModerationService();
    this.cacheService = new CacheService();
    this.userService = new UserService();
  }

  async getComments(contentId: string, options: {
    sort?: 'newest' | 'popular';
    include_replies?: boolean;
    page?: number;
    limit?: number;
  }) {
    const cacheKey = `comments:${contentId}:${JSON.stringify(options)}`;
    const cachedResult = await this.cacheService.get(cacheKey);

    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const query: any = {
      content: contentId,
      status: 'approved'
    };

    if (!options.include_replies) {
      query.parent_id = { $exists: false };
    }

    const sortOptions: any = {
      'newest': { created_at: -1 },
      'popular': { upvotes: -1, created_at: -1 }
    };

    const comments = await CommentModel.find(query)
      .sort(sortOptions[options.sort || 'newest'])
      .skip(((options.page || 1) - 1) * (options.limit || 10))
      .limit(options.limit || 10)
      .populate('author', 'name avatar')
      .lean();

    // Add user-specific data
    const enrichedComments = await this.enrichComments(comments);

    await this.cacheService.set(cacheKey, JSON.stringify(enrichedComments), 300); // 5 minutes cache

    return enrichedComments;
  }

  async createComment(data: {
    content: string;
    content_type: string;
    author: string;
    text: string;
    parent_id?: string;
    metadata: {
      ip: string;
      user_agent: string;
    };
  }) {
    // Check for spam
    const isSpam = await this.moderationService.checkSpam(data.text, {
      userId: data.author,
      ip: data.metadata.ip
    });

    if (isSpam) {
      throw new APIError('Spam detected', 400);
    }

    // Check content moderation
    const moderationResult = await this.moderationService.checkContent(data.text);
    
    const comment = await CommentModel.create({
      ...data,
      status: moderationResult.approved ? 'approved' : 'pending'
    });

    // If comment is approved, send notifications
    if (comment.status === 'approved') {
      await this.handleApprovedComment(comment);
    }

    // Clear cache
    await this.clearContentCache(data.content);

    return comment;
  }

  async updateComment(id: string, userId: string, text: string) {
    const comment = await CommentModel.findOne({ _id: id, author: userId });

    if (!comment) {
      throw new APIError('Comment not found or unauthorized', 404);
    }

    // Check moderation
    const moderationResult = await this.moderationService.checkContent(text);

    comment.text = text;
    comment.status = moderationResult.approved ? 'approved' : 'pending';
    await comment.save();

    // Clear cache
    await this.clearContentCache(comment.content.toString());

    return comment;
  }

  async deleteComment(id: string, userId: string) {
    const comment = await CommentModel.findOne({ _id: id });

    if (!comment) {
      throw new APIError('Comment not found', 404);
    }

    // Check permissions
    const canDelete = await this.userService.canDeleteComment(userId, comment);
    if (!canDelete) {
      throw new APIError('Unauthorized', 403);
    }

    await comment.remove();

    // Clear cache
    await this.clearContentCache(comment.content.toString());

    return { success: true };
  }

  async vote(commentId: string, userId: string, type: 'up' | 'down') {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      throw new APIError('Comment not found', 404);
    }

    // Remove existing vote
    const existingVoteIndex = comment.votes.findIndex(
      vote => vote.user.toString() === userId
    );

    if (existingVoteIndex > -1) {
      const existingVote = comment.votes[existingVoteIndex];
      if (existingVote.type === type) {
        // Remove vote if same type
        comment.votes.splice(existingVoteIndex, 1);
        comment[`${type}votes`]--;
      } else {
        // Change vote type
        existingVote.type = type;
        comment[`${existingVote.type}votes`]--;
        comment[`${type}votes`]++;
      }
    } else {
      // Add new vote
      comment.votes.push({ user: userId, type });
      comment[`${type}votes`]++;
    }

    await comment.save();

    // Clear cache
    await this.clearContentCache(comment.content.toString());

    return comment;
  }

  private async handleApprovedComment(comment: IComment) {
    // Notify content author
    if (!comment.parent_id) {
      await this.notificationService.createNotification({
        type: 'new_comment',
        user: comment.content,
        actor: comment.author,
        content: comment.content,
        data: { commentId: comment._id }
      });
    } else {
      // Notify parent comment author
      const parentComment = await CommentModel.findById(comment.parent_id);
      if (parentComment && parentComment.author.toString() !== comment.author.toString()) {
        await this.notificationService.createNotification({
          type: 'comment_reply',
          user: parentComment.author,
          actor: comment.author,
          content: comment.content,
          data: { commentId: comment._id }
        });
      }
    }
  }

  private async enrichComments(comments: any[]) {
    // Add user-specific data like user's vote
    return comments;
  }

  private async clearContentCache(contentId: string) {
    const patterns = [
      `comments:${contentId}:*`,
      `content:${contentId}:comments_count`
    ];
    await Promise.all(patterns.map(pattern => this.cacheService.deletePattern(pattern)));
  }
}