import express from 'express';
import {
  getAllMenuItems,
  getItemsByCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';

const router = express.Router();

// Get all menu items grouped by category
router.get('/', getAllMenuItems);

// Get items by category
router.get('/:category', getItemsByCategory);

// Add new menu item
router.post('/:category', addMenuItem);

// Update menu item
router.put('/:category/:id', updateMenuItem);

// Delete menu item
router.delete('/:category/:id', deleteMenuItem);

export default router;

