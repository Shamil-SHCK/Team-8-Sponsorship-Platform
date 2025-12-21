import express from 'express';
import { getPendingUsers, verifyUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and restricted to administrators
router.use(protect);
router.use(authorize('administrator'));

router.get('/users/pending', getPendingUsers);
router.put('/verify/:userId', verifyUser);

export default router;
