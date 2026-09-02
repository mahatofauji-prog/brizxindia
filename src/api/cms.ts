import { Router } from "express";

const router = Router();

// 9. CMS APIs

// GET /api/cms/banners
router.get("/banners", (req, res) => {
  res.json({ success: true, data: [] });
});

// POST /api/cms/banners
router.post("/banners", (req, res) => {
  res.json({ success: true, message: "Banner created" });
});

// GET /api/cms/pages
router.get("/pages", (req, res) => {
  res.json({ success: true, data: [] });
});

export default router;
