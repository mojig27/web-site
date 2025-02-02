
// backend/src/services/content.service.ts
import { ContentModel } from '../models/content.model';
import { PaginationOptions } from '../interfaces/pagination.interface';

export class ContentService {
  async getAll(type: string, options: PaginationOptions) {
    const { page, limit, sort, filter } = options;
    const skip = (page - 1) * limit;

    const query = { type, ...filter };
    const sortQuery = sort ? JSON.parse(sort) : { created_at: -1 };

    const [items, total] = await Promise.all([
      ContentModel.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email')
        .populate('category')
        .exec(),
      ContentModel.countDocuments(query)
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getById(id: string) {
    return await ContentModel.findById(id)
      .populate('author', 'name email')
      .populate('category')
      .exec();
  }

  async create(data: any) {
    const content = new ContentModel(data);
    return await content.save();
  }

  async update(id: string, data: any) {
    return await ContentModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).exec();
  }

  async delete(id: string) {
    return await ContentModel.findByIdAndDelete(id).exec();
  }

  async updateStatus(id: string, status: string) {
    return await ContentModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).exec();
  }
}

