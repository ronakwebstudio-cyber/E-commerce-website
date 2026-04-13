import dotenv from "dotenv";
import products from "./data/products.js";
import { connectDB, disconnectDB } from "./lib/db.js";
import Product from "./models/Product.js";

dotenv.config();

async function seed() {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products.`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

seed();
