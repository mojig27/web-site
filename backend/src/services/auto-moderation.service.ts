// backend/src/services/auto-moderation.service.ts
import { ML } from '../utils/ml';
import { Redis } from '../config/redis';
import { AdminNotificationService } from './admin-notification.service';
import { ContentFilterService } from './content-filter.service';
import { SpamDetectionService } from './spam-detection.service';

export class AutoModerationService {
  private ml: ML;
  private redis: Redis;
  private adminNotification: AdminNotificationService;
  private contentFilter: ContentFilterService;
  private spamDetector: SpamDetectionService;

  constructor() {
    this.ml = new ML();
    this.redis = new Redis();
    this.adminNotification = new AdminNotificationService();
    this.contentFilter = new ContentFilterService();
    this.spamDetector = new SpamDetectionService();
  }

  async processContent(content: {
    id: string;
    text: string;
    type: 'comment' | 'post' | 'review';
    author: {
      id: string;
      reputation: number;
      isNewUser: boolean;
    };
    metadata: {
      ip: string;
      userAgent: string;
    };
  }) {
    // 1. جمع‌آوری نتایج از سرویس‌های مختلف
    const [
      spamResult,
      contentResult,
      userHistory,
      similarContent
    ] = await Promise.all([
      this.spamDetector.analyze(content.text, {
        userId: content.author.id,
        ip: content.metadata.ip
      }),
      this.contentFilter.analyze(content.text),
      this.getUserModHistory(content.author.id),
      this.findSimilarContent(content.text)
    ]);

    // 2. محاسبه امتیاز نهایی و تصمیم‌گیری
    const decision = this.makeDecision({
      spamResult,
      contentResult,
      userHistory,
      similarContent,
      authorReputation: content.author.reputation,
      isNewUser: content.author.isNewUser
    });

    // 3. اعمال تصمیم
    await this.applyDecision(content.id, decision);

    // 4. بروزرسانی آمار و یادگیری
    await this.updateStats(decision);

    return decision;
  }

  private makeDecision(data: {
    spamResult: any;
    contentResult: any;
    userHistory: any;
    similarContent: any;
    authorReputation: number;
    isNewUser: boolean;
  }) {
    let score = 0;
    const reasons: string[] = [];
    const flags: string[] = [];

    // بررسی اسپم
    if (data.spamResult.isSpam) {
      score += 40;
      reasons.push('تشخیص اسپم');
      flags.push('SPAM');
    }

    // بررسی محتوای نامناسب
    if (data.contentResult.score > 0.7) {
      score += 30;
      reasons.push('محتوای نامناسب');
      flags.push('INAPPROPRIATE');
    }

    // بررسی سابقه کاربر
    if (data.userHistory.recentRejections > 2) {
      score += 20;
      reasons.push('سابقه رد شدن محتوا');
      flags.push('BAD_HISTORY');
    }

    // بررسی محتوای مشابه
    if (data.similarContent.duplicateCount > 0) {
      score += 15;
      reasons.push('محتوای تکراری');
      flags.push('DUPLICATE');
    }

    // تعدیل بر اساس اعتبار کاربر
    if (data.authorReputation > 100) {
      score = Math.max(0, score - 20);
    }

    // تصمیم نهایی
    let decision: 'approve' | 'reject' | 'review' = 'review';
    if (score < 30) {
      decision = 'approve';
    } else if (score > 70) {
      decision = 'reject';
    }

    return {
      decision,
      score,
      reasons,
      flags,
      confidence: this.calculateConfidence(score, data)
    };
  }

  private async applyDecision(contentId: string, decision: any) {
    // 1. اعمال تصمیم
    switch (decision.decision) {
      case 'approve':
        await this.approveContent(contentId);
        break;
      case 'reject':
        await this.rejectContent(contentId);
        break;
      case 'review':
        await this.flagForReview(contentId, decision);
        break;
    }

    // 2. نوتیفیکیشن به مدیران در صورت نیاز
    if (decision.decision === 'review' || decision.confidence < 0.8) {
      await this.notifyAdmins(contentId, decision);
    }

    // 3. ثبت در تاریخچه
    await this.logDecision(contentId, decision);
  }

  private async approveContent(contentId: string) {
    await Promise.all([
      // بروزرسانی وضعیت محتوا
      ContentModel.updateOne(
        { _id: contentId },
        { 
          status: 'approved',
          moderation_info: {
            auto_approved: true,
            approved_at: new Date()
          }
        }
      ),
      // پاک کردن از صف بررسی
      this.redis.del(`content:review:${contentId}`)
    ]);
  }

  private async rejectContent(contentId: string) {
    const content = await ContentModel.findById(contentId)
      .populate('author', 'email notifications_settings');

    await Promise.all([
      // بروزرسانی وضعیت محتوا
      content.updateOne({
        status: 'rejected',
        moderation_info: {
          auto_rejected: true,
          rejected_at: new Date()
        }
      }),
      // نوتیفیکیشن به نویسنده
      this.notifyAuthor(content)
    ]);
  }

  private async flagForReview(contentId: string, decision: any) {
    await Promise.all([
      // افزودن به صف بررسی
      this.redis.zadd(
        'content:review:queue',
        decision.score,
        contentId
      ),
      // ذخیره اطلاعات تصمیم
      this.redis.hset(
        `content:review:${contentId}`,
        {
          score: decision.score,
          reasons: JSON.stringify(decision.reasons),
          flags: JSON.stringify(decision.flags),
          created_at: Date.now()
        }
      )
    ]);
  }

  private async notifyAdmins(contentId: string, decision: any) {
    await this.adminNotification.createNotification({
      type: 'content_needs_review',
      title: 'محتوای نیازمند بررسی',
      message: `محتوای جدید با اسکور ${decision.score} نیاز به بررسی دارد`,
      data: {
        contentId,
        decision
      },
      priority: decision.score > 50 ? 'high' : 'medium'
    });
  }

  private calculateConfidence(score: number, data: any): number {
    // محاسبه ضریب اطمینان بر اساس فاکتورهای مختلف
    let confidence = 0;

    // وزن‌دهی به نتایج سرویس‌های مختلف
    if (data.spamResult.confidence > 0.9) confidence += 0.3;
    if (data.contentResult.confidence > 0.9) confidence += 0.3;
    if (data.similarContent.similarity > 0.9) confidence += 0.2;
    if (Math.abs(score - 50) > 30) confidence += 0.2;

    return Math.min(1, confidence);
  }

  private async updateStats(decision: any) {
    const date = new Date().toISOString().split('T')[0];
    const key = `stats:moderation:${date}`;

    await this.redis.hincrby(key, `decisions:${decision.decision}`, 1);
    for (const flag of decision.flags) {
      await this.redis.hincrby(key, `flags:${flag}`, 1);
    }
  }
}

