// backend/src/routes/product.routes.ts
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ProductValidation } from '../validations/product.validation';

const router = Router();
const productController = new ProductController();

// مسیرهای عمومی
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProduct);
router.get('/:id/related', productController.getRelatedProducts);

// مسیرهای مدیریتی (نیاز به احراز هویت)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', validate(ProductValidation), productController.createProduct);
router.patch('/:id', validate(ProductValidation.partial()), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;