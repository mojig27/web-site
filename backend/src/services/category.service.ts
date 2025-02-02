
// backend/src/services/category.service.ts
import { CategoryModel } from '../models/category.model';
import { ContentModel } from '../models/content.model';
import { PaginationOptions } from '../interfaces/pagination.interface';

export class CategoryService {
  async getAll(filters: { type?: string; parent?: string }) {
    const query: any = {};
    if (filters.type) query.type = filters.type;
    if (filters.parent) {
      query.parent = filters.parent;
    } else {
      query.parent = { $exists: false };
    }

    return await CategoryModel.find(query)
      .sort({ order: 1, name: 1 })
      .populate('parent')
      .exec();
  }

  async getTree() {
    const categories = await CategoryModel.find()
      .sort({ order: 1, name: 1 })
      .lean()
      .exec();

    const buildTree = (parent: string | null = null): any[] => {
      return categories
        .filter(c => 
          parent ? c.parent?.toString() === parent : !c.parent
        )
        .map(category => ({
          ...category,
          children: buildTree(category._id.toString())
        }));
    };

    return buildTree();
  }

  async getById(id: string) {
    return await CategoryModel.findById(id)
      .populate('parent')
      .exec();
  }

  async create(data: any) {
    const category = new CategoryModel(data);
    return await category.save();
  }

  async update(id: string, data: any) {
    return await CategoryModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).exec();
  }

  async delete(id: string) {
    return await CategoryModel.findByIdAndDelete(id).exec();
  }

  async checkDuplicate(name: string, parent: string | null, excludeId?: string) {
    const query: any = { name };
    if (parent) {
      query.parent = parent;
    } else {
      query.parent = { $exists: false };
    }
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return await CategoryModel.exists(query);
  }

  async checkContent(categoryId: string) {
    return await ContentModel.exists({ category: categoryId });
  }

  async getCategoryContent(categoryId: string, options: PaginationOptions) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ContentModel.find({ category: categoryId })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email')
        .exec(),
      ContentModel.countDocuments({ category: categoryId })
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
