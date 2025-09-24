import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    // await mongoose.connect(process.env.MONGODB_URI as string);
    // console.log("Connected to MongoDB");
    const uri = process.env.MONGODB_URI as string;
    if (!uri) throw new Error("MONGODB_URI is not defined");

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
