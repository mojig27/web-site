// backend/src/routes/content.routes.ts
import { Router } from 'express';
import { auth, checkRole } from '../middlewares';
import { ContentController } from '../controllers/content.controller';

const router = Router();
const controller = new ContentController();

router.get('/:type', auth, controller.getAll);
router.get('/:type/:id', auth, controller.getById);
router.post('/', auth, checkRole(['admin', 'editor']), controller.create);
router.put('/:id', auth, checkRole(['admin', 'editor']), controller.update);
router.delete('/:id', auth, checkRole(['admin']), controller.delete);
router.post('/:id/publish', auth, checkRole(['admin', 'editor']), controller.publish);
router.post('/:id/unpublish', auth, checkRole(['admin', 'editor']), controller.unpublish);

export default router;
