// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/database.js';
import { configureCloudinary } from './config/cloudinary.js';
import { multerErrorHandler } from './middleware/errorHandler.js';

// Import routes
import menuRoutes from './routes/menuRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

// Configure Cloudinary now that env vars are loaded
console.log('🔧 Initializing Cloudinary configuration...');
try {
  configureCloudinary();
} catch (error) {
  console.error('⚠️  Cloudinary configuration failed:', error.message);
  console.error('   Server will continue, but image uploads may not work.');
}

// Connect to MongoDB
connectDB();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/dashboard', dashboardRoutes);

// Error handler for multer
app.use(multerErrorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}/dashboard`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error(`\n🔧 To fix this, run one of these commands:`);
    console.error(`   kill -9 $(lsof -ti:${PORT})`);
    console.error(`   or`);
    console.error(`   pkill -f "node.*server.js"`);
    console.error(`\n💡 Or use a different port by setting PORT environment variable`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
