import express from 'express';
import { renderDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

// Serve dashboard
router.get('/', renderDashboard);

export default router;

