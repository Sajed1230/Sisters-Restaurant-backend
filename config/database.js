import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sisters-restaurant';
    
    if (!mongoURI) {
      console.warn('⚠️  MONGODB_URI not set, using default local connection');
    }
    
    console.log('🔄 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    
    if (error.message.includes('querySrv ESERVFAIL')) {
      console.error('\n🔍 DNS Resolution Error - Troubleshooting:');
      console.error('1. Check your internet connection');
      console.error('2. Try again in a few seconds (DNS may be resolving)');
      console.error('3. Verify the cluster hostname in MongoDB Atlas dashboard');
      console.error('4. Check if your IP is whitelisted in MongoDB Atlas Network Access');
      console.error('5. Try using Google DNS (8.8.8.8) if DNS is the issue');
      
      // Retry connection after a delay
      console.log('\n🔄 Retrying connection in 5 seconds...');
      setTimeout(() => {
        connectDB().catch(() => {
          console.warn('⚠️  Retry failed. Server will continue without database.');
        });
      }, 5000);
    } else {
      // Don't exit in development - allow server to start without DB
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      } else {
        console.warn('⚠️  Server will continue without database connection (development mode)');
      }
    }
  }
};

export default connectDB;

