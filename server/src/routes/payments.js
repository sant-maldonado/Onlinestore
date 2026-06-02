import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { createCheckoutSession, handleWebhook } from '../controllers/paymentController.js';

const router = Router();

router.post('/checkout', authenticate, createCheckoutSession);
router.post('/webhook', handleWebhook);

export default router;
