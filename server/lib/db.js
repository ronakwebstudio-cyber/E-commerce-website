import mongoose from "mongoose";

let hasConnected = false;

export async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is required to connect to MongoDB.");
  }

  if (hasConnected) {
    return mongoose.connection;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || "techstore"
  });
  hasConnected = true;
  return mongoose.connection;
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  hasConnected = false;
}
