import { Router } from "express";

const router = Router();

// 12. Analytics APIs

// GET /api/analytics/overview
router.get("/overview", (req, res) => {
  res.json({ success: true, data: {} });
});

// GET /api/analytics/users
router.get("/users", (req, res) => {
  res.json({ success: true, data: [] });
});

// GET /api/analytics/revenue
router.get("/revenue", (req, res) => {
  res.json({ success: true, data: [] });
});

export default router;
