import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri: string | undefined = process.env.MONGO_URI;
  
  if (!uri) {
    console.error('MONGO_URI missing in .env');
    process.exit(1);
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

export default connectDB;
