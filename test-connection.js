import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }
  
  console.log('🔍 Testing MongoDB connection...');
  console.log('📍 Connection string:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Test a simple query
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.length}`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('querySrv ESERVFAIL')) {
      console.error('\n🔍 This is a DNS resolution error. Possible solutions:');
      console.error('1. Check your internet connection');
      console.error('2. Verify the cluster hostname in MongoDB Atlas dashboard');
      console.error('3. Try using a different DNS server (8.8.8.8)');
      console.error('4. Check if your firewall is blocking DNS queries');
      console.error('5. Verify your MongoDB Atlas cluster is active');
    } else if (error.message.includes('authentication')) {
      console.error('\n🔍 Authentication failed. Check your username and password');
    } else if (error.message.includes('timeout')) {
      console.error('\n🔍 Connection timeout. Check your network and firewall settings');
    }
    
    process.exit(1);
  }
};

testConnection();


