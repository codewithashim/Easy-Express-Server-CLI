import mongoose from "mongoose";
import envConfig from "./envConfig.js";

export default async function connectToDB() {
  try {
    await mongoose.connect(envConfig.MONGO_URI);
    console.log("🛢 Database is connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB 🛢", error);
  }
}