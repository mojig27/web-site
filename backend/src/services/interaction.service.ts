// backend/src/services/interaction.service.ts
import { ContentModel } from '../models/content.model';
import { InteractionModel } from '../models/interaction.model';
import { UserModel } from '../models/user.model';
import { NotificationService } from './notification.service';

export class InteractionService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async getStats(contentId: string, userId?: string) {
    const [interactions, userInteraction] = await Promise.all([
      InteractionModel.aggregate([
        { $match: { content: contentId } },
        {
          $group: {
            _id: '$content',
            likes: { $sum: { $cond: [{ $eq: ['$type', 'like'] }, 1, 0] } },
            bookmarks: { $sum: { $cond: [{ $eq: ['$type', 'bookmark'] }, 1, 0] } },
            shares: { $sum: { $cond: [{ $eq: ['$type', 'share'] }, 1, 0] } }
          }
        }
      ]),
      userId ? InteractionModel.find({
        content: contentId,
        user: userId,
        type: { $in: ['like', 'bookmark'] }
      }) : []
    ]);

    const stats = interactions[0] || { likes: 0, bookmarks: 0, shares: 0 };
    
    if (userId) {
      const userInteractions = new Set(
        userInteraction.map(interaction => interaction.type)
      );
      return {
        ...stats,
        isLiked: userInteractions.has('like'),
        isBookmarked: userInteractions.has('bookmark')
      };
    }

    return stats;
  }

  async toggleInteraction(contentId: string, userId: string, type: 'like' | 'bookmark') {
    const existingInteraction = await InteractionModel.findOne({
      content: contentId,
      user: userId,
      type
    });

    if (existingInteraction) {
      await existingInteraction.remove();
      return { [type + 's']: await this.getInteractionCount(contentId, type) };
    }

    const interaction = await InteractionModel.create({
      content: contentId,
      user: userId,
      type
    });

    // Send notification to content author
    const content = await ContentModel.findById(contentId);
    if (content && content.author.toString() !== userId) {
      await this.notificationService.create({
        type: `content_${type}`,
        user: content.author,
        actor: userId,
        content: contentId
      });
    }

    return {
      [type + 's']: await this.getInteractionCount(contentId, type),
      ['is' + type.charAt(0).toUpperCase() + type.slice(1)]: true
    };
  }

  async share(contentId: string, userId: string, platform: string) {
    await InteractionModel.create({
      content: contentId,
      user: userId,
      type: 'share',
      metadata: { platform }
    });

    // Update share count in cache
    const shareCount = await this.getInteractionCount(contentId, 'share');
    
    return { shares: shareCount };
  }

  private async getInteractionCount(contentId: string, type: string) {
    return await InteractionModel.countDocuments({
      content: contentId,
      type
    });
  }
}