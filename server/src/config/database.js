import mongoose from 'mongoose';

/**
 * MongoDB connection with retry logic
 */
const connectDB = async (retries = 5, delay = 5000) => {
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, options);

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log(`Database: ${conn.connection.name}`);

      // Setup connection event handlers
      setupConnectionHandlers();

      return conn;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);

      if (attempt === retries) {
        console.error('Max retry attempts reached. Exiting...');
        process.exit(1);
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Setup MongoDB connection event handlers
 */
const setupConnectionHandlers = () => {
  // Connection error handler
  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

  // Disconnection handler
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
  });

  // Reconnection handler
  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });

  // Connection successful handler
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established');
  });

  // Graceful shutdown handlers
  process.on('SIGINT', async () => {
    await gracefulShutdown('SIGINT');
  });

  process.on('SIGTERM', async () => {
    await gracefulShutdown('SIGTERM');
  });
};

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} signal received: closing MongoDB connection`);
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during MongoDB connection closure:', error);
    process.exit(1);
  }
};

export default connectDB;
