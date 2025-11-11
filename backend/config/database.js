import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // MongoDB connection options for better compatibility
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 Check: MongoDB connection string is correct');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔍 Check: Username and password are correct');
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('🔍 Check: IP address is whitelisted in MongoDB Atlas');
      console.error('🔍 Check: Network firewall settings');
    }
    
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 Mongoose connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
