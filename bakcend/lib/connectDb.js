import mongoose from "mongoose";
import "dotenv/config";

const URI = process.env.MONGO_URI;

export const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB Connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed to Connect to Database", error.message);
    process.exit(1);
  }
};
