// backend/src/services/search.service.ts
import { ContentModel } from '../models/content.model';
import { CategoryModel } from '../models/category.model';
import { SearchOptions } from '../interfaces/search.interface';
import { createSearchQuery } from '../utils/search.utils';
import { redisClient } from '../config/redis';

export class SearchService {
  private CACHE_TTL = 3600; // 1 hour

  async search(options: SearchOptions) {
    const cacheKey = this.generateCacheKey(options);
    
    // Try to get from cache first
    const cachedResult = await this.getFromCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const {
      query,
      type,
      category,
      tags,
      status,
      author,
      dateRange,
      page = 1,
      limit = 10,
      sort = { created_at: -1 }
    } = options;

    const searchQuery = createSearchQuery({
      query,
      type,
      category,
      tags,
      status,
      author,
      dateRange
    });

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ContentModel.find(searchQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email')
        .populate('category')
        .exec(),
      ContentModel.countDocuments(searchQuery)
    ]);

    const result = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };

    // Cache the result
    await this.cacheResult(cacheKey, result);

    return result;
  }

  async suggest(query: string, type?: string) {
    const cacheKey = `suggest:${type || 'all'}:${query}`;
    
    // Try to get suggestions from cache
    const cachedSuggestions = await this.getFromCache(cacheKey);
    if (cachedSuggestions) {
      return cachedSuggestions;
    }

    const searchQuery: any = {
      $or: [
        { title: new RegExp(query, 'i') },
        { content: new RegExp(query, 'i') },
        { tags: new RegExp(query, 'i') }
      ]
    };

    if (type) {
      searchQuery.type = type;
    }

    const suggestions = await ContentModel.find(searchQuery)
      .select('title type tags')
      .limit(10)
      .exec();

    // Cache suggestions
    await this.cacheResult(cacheKey, suggestions, 1800); // 30 minutes

    return suggestions;
  }

  async advancedSearch(options: SearchOptions) {
    const {
      query,
      filters = {},
      aggregations = [],
      page = 1,
      limit = 10
    } = options;

    const pipeline: any[] = [];

    // Match stage
    if (query || Object.keys(filters).length > 0) {
      pipeline.push({
        $match: {
          ...createSearchQuery({ query, ...filters }),
          status: 'published' // Only published content
        }
      });
    }

    // Aggregations
    if (aggregations.includes('categories')) {
      pipeline.push({
        $facet: {
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: '_id',
              as: 'category'
            }},
            { $unwind: '$category' },
            { $project: {
              _id: 1,
              name: '$category.name',
              count: 1
            }}
          ],
          tags: [
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
          ],
          content: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              as: 'author'
            }},
            { $unwind: '$author' },
            { $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'category'
            }},
            { $unwind: { 
              path: '$category',
              preserveNullAndEmptyArrays: true
            }}
          ]
        }
      });
    } else {
      // Simple pagination without aggregations
      pipeline.push(
        { $skip: (page - 1) * limit },
        { $limit: limit }
      );
    }

    const result = await ContentModel.aggregate(pipeline).exec();
    return aggregations.length > 0 ? result[0] : { content: result };
  }

  private generateCacheKey(options: SearchOptions): string {
    return `search:${JSON.stringify(options)}`;
  }

  private async getFromCache(key: string) {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  private async cacheResult(key: string, data: any, ttl: number = this.CACHE_TTL) {
    await redisClient.setex(key, ttl, JSON.stringify(data));
  }
}
