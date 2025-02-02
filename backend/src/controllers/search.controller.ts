
// backend/src/routes/search.routes.ts
import { Router } from 'express';
import { auth } from '../middlewares';
import { SearchController } from '../controllers/search.controller';

const router = Router();
const controller = new SearchController();

router.get('/', auth, controller.search);
router.get('/suggest', auth, controller.suggest);
router.post('/advanced', auth, controller.advancedSearch);

export default router;

// backend/src/controllers/search.controller.ts
import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';

export class SearchController {
  private service: SearchService;

  constructor() {
    this.service = new SearchService();
  }

  search = async (req: Request, res: Response) => {
    try {
      const result = await this.service.search(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'خطا در جستجو' });
    }
  };

  suggest = async (req: Request, res: Response) => {
    try {
      const { q, type } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'پارامتر جستجو الزامی است' });
      }

      const suggestions = await this.service.suggest(
        q as string,
        type as string
      );
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: 'خطا در دریافت پیشنهادات' });
    }
  };

  advancedSearch = async (req: Request, res: Response) => {
    try {
      const result = await this.service.advancedSearch(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'خطا در جستجوی پیشرفته' });
    }
  };
}