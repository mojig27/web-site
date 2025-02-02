
// backend/src/controllers/content.controller.ts
import { Request, Response } from 'express';
import { ContentService } from '../services/content.service';
import { validateContent } from '../validators/content.validator';

export class ContentController {
  private service: ContentService;

  constructor() {
    this.service = new ContentService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const { page = 1, limit = 10, sort, filter } = req.query;

      const result = await this.service.getAll(type, {
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
        filter: filter ? JSON.parse(String(filter)) : {}
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'خطا در دریافت اطلاعات' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.service.getById(id);

      if (!result) {
        return res.status(404).json({ error: 'محتوا یافت نشد' });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'خطا در دریافت اطلاعات' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { error } = validateContent(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await this.service.create({
        ...req.body,
        author: req.user.id
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'خطا در ایجاد محتوا' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { error } = validateContent(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await this.service.update(id, req.body);
      if (!result) {
        return res.status(404).json({ error: 'محتوا یافت نشد' });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'خطا در بروزرسانی محتوا' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);

      if (!result) {
        return res.status(404).json({ error: 'محتوا یافت نشد' });
      }

      res.json({ message: 'محتوا با موفقیت حذف شد' });
    } catch (error) {
      res.status(500).json({ error: 'خطا در حذف محتوا' });
    }
  };

  publish = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.service.updateStatus(id, 'published');

      if (!result) {
        return res.status(404).json({ error: 'محتوا یافت نشد' });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'خطا در انتشار محتوا' });
    }
  };

  unpublish = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.service.updateStatus(id, 'draft');

      if (!result) {
        return res.status(404).json({ error: 'محتوا یافت نشد' });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'خطا در لغو انتشار محتوا' });
    }
  };
}
