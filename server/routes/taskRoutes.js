import express from 'express';
import { taskController } from '../controllers/taskController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyAuth);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/sync-calendar', taskController.syncCalendar);

export default router;
