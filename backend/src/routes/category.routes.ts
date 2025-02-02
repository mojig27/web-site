// backend/src/routes/category.routes.ts
import { Router } from 'express';
import { auth, checkRole } from '../middlewares';
import { CategoryController } from '../controllers/category.controller';

const router = Router();
const controller = new CategoryController();

router.get('/', auth, controller.getAll);
router.get('/:id', auth, controller.getById);
router.post('/', auth, checkRole(['admin']), controller.create);
router.put('/:id', auth, checkRole(['admin']), controller.update);
router.delete('/:id', auth, checkRole(['admin']), controller.delete);
router.get('/:id/content', auth, controller.getCategoryContent);

export default router;
