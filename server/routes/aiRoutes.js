import express from 'express';
import { aiController } from '../controllers/aiController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyAuth);

router.post('/generate-plan', aiController.generatePlan);
router.post('/daily-plan', aiController.dailyPlan);
router.post('/chat', aiController.chat);
router.post('/smart-notification', aiController.smartNotification);

export default router;
