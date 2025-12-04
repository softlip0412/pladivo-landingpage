import mongoose from "mongoose";
import { MongoClient } from "mongodb";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME || "pladivo-app",
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

// For NextAuth MongoDB adapter
const uri = process.env.MONGO_URL;
const options = {
  dbName: process.env.DB_NAME || "pladivo-app",
};

let client;
let clientPromise;

if (!process.env.MONGO_URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
