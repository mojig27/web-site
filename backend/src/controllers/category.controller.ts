
// backend/src/controllers/category.controller.ts
import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { validateCategory } from '../validators/category.validator';

export class CategoryController {
  private service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const { type, parent, includeTree = false } = req.query;
      
      const categories = includeTree === 'true'
        ? await this.service.getTree()
        : await this.service.getAll({
            type: type as string,
            parent: parent as string
          });

      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'خطا در دریافت دسته‌بندی‌ها' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await this.service.getById(id);

      if (!category) {
        return res.status(404).json({ error: 'دسته‌بندی یافت نشد' });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'خطا در دریافت دسته‌بندی' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { error } = validateCategory(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // بررسی تکراری نبودن نام در همان سطح
      const exists = await this.service.checkDuplicate(
        req.body.name,
        req.body.parent
      );
      if (exists) {
        return res.status(400).json({
          error: 'دسته‌بندی با این نام در این سطح وجود دارد'
        });
      }

      const category = await this.service.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'خطا در ایجاد دسته‌بندی' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { error } = validateCategory(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // بررسی تکراری نبودن نام در همان سطح
      const exists = await this.service.checkDuplicate(
        req.body.name,
        req.body.parent,
        id
      );
      if (exists) {
        return res.status(400).json({
          error: 'دسته‌بندی با این نام در این سطح وجود دارد'
        });
      }

      const category = await this.service.update(id, req.body);
      if (!category) {
        return res.status(404).json({ error: 'دسته‌بندی یافت نشد' });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'خطا در بروزرسانی دسته‌بندی' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // بررسی وجود محتوا در دسته‌بندی
      const hasContent = await this.service.checkContent(id);
      if (hasContent) {
        return res.status(400).json({
          error: 'این دسته‌بندی دارای محتوا است و قابل حذف نیست'
        });
      }

      const result = await this.service.delete(id);
      if (!result) {
        return res.status(404).json({ error: 'دسته‌بندی یافت نشد' });
      }

      res.json({ message: 'دسته‌بندی با موفقیت حذف شد' });
    } catch (error) {
      res.status(500).json({ error: 'خطا در حذف دسته‌بندی' });
    }
  };

  getCategoryContent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await this.service.getCategoryContent(id, {
        page: Number(page),
        limit: Number(limit)
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'خطا در دریافت محتوای دسته‌بندی' });
    }
  };
}
