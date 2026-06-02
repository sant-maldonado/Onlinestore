import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getUserOrders, getUserOrder } from '../controllers/orderController.js';

const router = Router();

router.use(authenticate);
router.get('/', getUserOrders);
router.get('/:id', getUserOrder);

export default router;
