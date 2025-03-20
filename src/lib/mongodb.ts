import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';
console.log('MONGO_URI:', MONGO_URI);

if (!MONGO_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default dbConnect;
