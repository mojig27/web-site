// backend/src/services/spam-detection.service.ts
import { Redis } from '../config/redis';
import { UserModel } from '../models/user.model';
import { CommentModel } from '../models/comment.model';
import { ML } from '../utils/ml';
import { config } from '../config';

export class SpamDetectionService {
  private redis: Redis;
  private ml: ML;

  constructor() {
    this.redis = new Redis();
    this.ml = new ML();
  }

  async analyze(text: string, context: {
    userId: string;
    ip: string;
    userAgent?: string;
  }): Promise<{
    isSpam: boolean;
    score: number;
    reasons: string[];
  }> {
    const [
      userHistory,
      ipHistory,
      contentAnalysis,
      patternMatch
    ] = await Promise.all([
      this.checkUserHistory(context.userId),
      this.checkIPHistory(context.ip),
      this.analyzeContent(text),
      this.checkPatterns(text)
    ]);

    const score = this.calculateSpamScore({
      userHistory,
      ipHistory,
      contentAnalysis,
      patternMatch
    });

    return {
      isSpam: score > config.spam.threshold,
      score,
      reasons: this.getSpamReasons({
        userHistory,
        ipHistory,
        contentAnalysis,
        patternMatch
      })
    };
  }

  private async checkUserHistory(userId: string) {
    const cacheKey = `spam:user:${userId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Get user's recent activity
    const [user, recentComments] = await Promise.all([
      UserModel.findById(userId).select('created_at reputation flags'),
      CommentModel.find({
        author: userId,
        created_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }).select('status created_at')
    ]);

    const result = {
      accountAge: Date.now() - user.created_at.getTime(),
      reputation: user.reputation,
      flags: user.flags,
      recentCommentsCount: recentComments.length,
      rejectedCommentsCount: recentComments.filter(c => c.status === 'rejected').length
    };

    await this.redis.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  private async checkIPHistory(ip: string) {
    const cacheKey = `spam:ip:${ip}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Get IP's recent activity
    const recentActivity = await CommentModel.aggregate([
      {
        $match: {
          'metadata.ip': ip,
          created_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: null,
          totalComments: { $sum: 1 },
          uniqueUsers: { $addToSet: '$author' },
          rejectedComments: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = recentActivity[0] || {
      totalComments: 0,
      uniqueUsers: [],
      rejectedComments: 0
    };

    await this.redis.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  private async analyzeContent(text: string) {
    // Use ML model for content analysis
    const analysis = await this.ml.analyzeText(text);

    return {
      toxicity: analysis.toxicity,
      spamProbability: analysis.spamProbability,
      duplicateContent: analysis.duplicateContent,
      language: analysis.language,
      sentiment: analysis.sentiment
    };
  }

  private async checkPatterns(text: string) {
    const patterns = {
      urls: /(https?:\/\/[^\s]+)/g,
      emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      phones: /(\+\d{1,3}[\s.-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
      repeatedChars: /(.)\1{4,}/g,
      allCaps: text.toUpperCase() === text && text.length > 10
    };

    return {
      urlCount: (text.match(patterns.urls) || []).length,
      emailCount: (text.match(patterns.emails) || []).length,
      phoneCount: (text.match(patterns.phones) || []).length,
      hasRepeatedChars: patterns.repeatedChars.test(text),
      isAllCaps: patterns.allCaps
    };
  }

  private calculateSpamScore(data: any) {
    let score = 0;

    // User history factors
    if (data.userHistory.accountAge < 24 * 60 * 60 * 1000) score += 0.3; // New account
    if (data.userHistory.reputation < 0) score += 0.2;
    if (data.userHistory.flags > 3) score += 0.2;
    if (data.userHistory.rejectedCommentsCount > 2) score += 0.3;

    // IP history factors
    if (data.ipHistory.totalComments > 50) score += 0.3; // Too many comments
    if (data.ipHistory.rejectedComments > 5) score += 0.4;
    if (data.ipHistory.uniqueUsers.length > 3) score += 0.3; // Multiple users

    // Content analysis factors
    if (data.contentAnalysis.toxicity > 0.7) score += 0.4;
    if (data.contentAnalysis.spamProbability > 0.6) score += 0.4;
    if (data.contentAnalysis.duplicateContent) score += 0.5;

    // Pattern matching factors
    if (data.patternMatch.urlCount > 2) score += 0.3;
    if (data.patternMatch.hasRepeatedChars) score += 0.2;
    if (data.patternMatch.isAllCaps) score += 0.2;

    return Math.min(1, score);
  }

  private getSpamReasons(data: any): string[] {
    const reasons: string[] = [];

    // Add reasons based on various factors
    if (data.userHistory.accountAge < 24 * 60 * 60 * 1000) {
      reasons.push('حساب کاربری جدید');
    }
    if (data.userHistory.rejectedCommentsCount > 2) {
      reasons.push('سابقه رد شدن نظرات');
    }
    if (data.ipHistory.totalComments > 50) {
      reasons.push('تعداد زیاد نظرات از یک IP');
    }
    if (data.contentAnalysis.toxicity > 0.7) {
      reasons.push('محتوای نامناسب');
    }
    if (data.contentAnalysis.duplicateContent) {
      reasons.push('محتوای تکراری');
    }
    if (data.patternMatch.urlCount > 2) {
      reasons.push('تعداد زیاد لینک');
    }

    return reasons;
  }
}

