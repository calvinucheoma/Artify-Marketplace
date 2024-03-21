import mongoose from 'mongoose';

let isConnected = false; //Track the connection

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MobgoDB is connected successfully');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: 'artify',
    });

    isConnected = true;

    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error);
  }
};
