import MenuItem from '../models/MenuItem.js';

// Helper function to group items by category
const groupItemsByCategory = (items) => {
  const menuData = {
    appetizers: [],
    mainDishes: [],
    grills: [],
    desserts: [],
    beverages: [],
    sandwiches: []
  };
  
  items.forEach(item => {
    if (menuData[item.category]) {
      menuData[item.category].push(item);
    }
  });
  
  return menuData;
};

// Serve dashboard
export const renderDashboard = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    const menuData = groupItemsByCategory(items);
    res.render('dashboard', { menuData });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.render('dashboard', { 
      menuData: {
        appetizers: [],
        mainDishes: [],
        grills: [],
        desserts: [],
        beverages: [],
        sandwiches: []
      }
    });
  }
};

