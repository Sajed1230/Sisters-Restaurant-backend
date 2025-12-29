import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  },
  cloudinaryId: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizers', 'mainDishes', 'grills', 'desserts', 'beverages', 'sandwiches']
  }
}, {
  timestamps: true
});

export default mongoose.model('MenuItem', menuItemSchema);

