import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const port = Number(process.env.PORT || 5000);

async function startServer() {
  await connectDB(process.env.MONGODB_URI);

  const app = createApp();
  app.listen(port, () => {
    console.log(`TechStore API listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
