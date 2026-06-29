import express from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyAuth);

router.get('/', analyticsController.getAnalytics);

export default router;
