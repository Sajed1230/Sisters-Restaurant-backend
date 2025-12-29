import MenuItem from '../models/MenuItem.js';
import { cloudinary } from '../config/cloudinary.js';

// Helper function to group items by category
const groupItemsByCategory = (items) => {
  const grouped = {
    appetizers: [],
    mainDishes: [],
    grills: [],
    desserts: [],
    beverages: [],
    sandwiches: []
  };
  
  items.forEach(item => {
    if (grouped[item.category]) {
      grouped[item.category].push(item);
    }
  });
  
  return grouped;
};

// Get all menu items grouped by category
export const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    const grouped = groupItemsByCategory(items);
    res.json(grouped);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu data' });
  }
};

// Get items by category
export const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await MenuItem.find({ category }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching category items:', error);
    res.status(500).json({ error: 'Failed to fetch category items' });
  }
};

// Add new menu item
export const addMenuItem = async (req, res) => {
  try {
    const { category } = req.params;
    const { name, description, price, image, cloudinaryId } = req.body;

    // Validation
    if (!name || !description || !price) {
      return res.status(400).json({ error: 'Missing required fields: name, description, price' });
    }

    const validCategories = ['appetizers', 'mainDishes', 'grills', 'desserts', 'beverages', 'sandwiches'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const newItem = new MenuItem({
      name: typeof name === 'string' ? { en: name, ar: name } : name,
      description: typeof description === 'string' ? { en: description, ar: description } : description,
      price: parseInt(price),
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      cloudinaryId: cloudinaryId || null,
      category
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { category, id } = req.params;
    const { name, description, price, image, cloudinaryId, category: newCategory } = req.body;

    console.log('🔄 Update request:', { category, id, newCategory, body: req.body });
    
    const item = await MenuItem.findById(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Allow category change - check if newCategory is provided and valid
    if (newCategory && newCategory !== category) {
      const validCategories = ['appetizers', 'mainDishes', 'grills', 'desserts', 'beverages', 'sandwiches'];
      if (validCategories.includes(newCategory)) {
        console.log(`📦 Moving item from ${category} to ${newCategory}`);
        item.category = newCategory;
      } else {
        return res.status(400).json({ error: 'Invalid category' });
      }
    } else if (item.category !== category) {
      // If no new category provided but URL category doesn't match, it's an error
      return res.status(400).json({ error: 'Category mismatch' });
    }

    // Update fields
    if (name) {
      item.name = typeof name === 'string' 
        ? { en: name, ar: name } 
        : { ...item.name, ...name };
    }
    if (description) {
      item.description = typeof description === 'string'
        ? { en: description, ar: description }
        : { ...item.description, ...description };
    }
    if (price !== undefined) {
      item.price = parseInt(price);
    }
    if (image) {
      // If new image is provided and old one was from Cloudinary, delete old image
      if (item.cloudinaryId && image !== item.image) {
        try {
          await cloudinary.uploader.destroy(item.cloudinaryId);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
        }
      }
      item.image = image;
      item.cloudinaryId = cloudinaryId || null;
    }

    const updatedItem = await item.save();
    console.log('✅ Item updated successfully');
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { category, id } = req.params;
    
    console.log('🗑️ Delete request:', { category, id });

    const item = await MenuItem.findById(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.category !== category) {
      return res.status(400).json({ error: 'Category mismatch' });
    }

    // Delete image from Cloudinary if it exists
    if (item.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(item.cloudinaryId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await MenuItem.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};

