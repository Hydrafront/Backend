import mongoose from 'mongoose';
import config from 'config';

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // Try to get MongoDB URI from environment variable first, then config
    const mongoURI: string = process.env.MONGODB_URI || config.get('mongoURI');
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;

