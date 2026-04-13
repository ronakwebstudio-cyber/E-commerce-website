import { Router } from "express";

const healthRoutes = Router();

healthRoutes.get("/", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

export default healthRoutes;
