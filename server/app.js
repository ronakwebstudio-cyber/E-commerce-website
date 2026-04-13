import cors from "cors";
import express from "express";
import morgan from "morgan";
import healthRoutes from "./routes/healthRoutes.js";
import productRoutes from "./routes/productRoutes.js";

function resolveCorsOrigin(originValue) {
  if (!originValue || originValue === "*") {
    return true;
  }

  if (Array.isArray(originValue)) {
    return originValue;
  }

  return originValue
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function createApp(options = {}) {
  const app = express();
  const corsOrigin = options.corsOrigin ?? process.env.CORS_ORIGIN ?? "*";

  app.use(
    cors({
      origin: resolveCorsOrigin(corsOrigin),
      credentials: true
    })
  );
  app.use(express.json());

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.use("/api/health", healthRoutes);
  app.use("/api/products", productRoutes);

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    if (process.env.NODE_ENV !== "test") {
      console.error(err);
    }
    res.status(status).json({ message });
  });

  return app;
}
