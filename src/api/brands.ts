import { Router } from "express";

const router = Router();

// 4. Brand APIs

// GET /api/brands
router.get("/", (req, res) => {
  // TODO: Search and filter franchise brands for public/seeker portal
  res.json({ success: true, data: [] });
});

// GET /api/brands/:id
router.get("/:id", (req, res) => {
  // TODO: Return detailed brand profile including franchise formats
  res.json({ success: true, data: { id: req.params.id, brandName: "Sample Brand" } });
});

// PUT /api/brands/:id
router.put("/:id", (req, res) => {
  // TODO: Update brand profile
  res.json({ success: true, message: "Brand profile updated" });
});

// POST /api/brands/:id/unlock-lead
router.post("/:id/unlock-lead", (req, res) => {
  // TODO: Implement lead unlock logic (deduct credit, link seeker to brand CRM)
  res.json({ success: true, message: "Lead unlocked successfully" });
});

export default router;
