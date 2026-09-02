import { Router } from "express";

const router = Router();

// 3. Franchise Seeker APIs

// GET /api/seekers
router.get("/", (req, res) => {
  // TODO: Return paginated and filtered list of franchise seekers
  res.json({ success: true, data: [] });
});

// GET /api/seekers/:id
router.get("/:id", (req, res) => {
  // TODO: Return detailed profile of a specific seeker
  res.json({ success: true, data: { id: req.params.id, name: "Sample Seeker" } });
});

// PUT /api/seekers/:id
router.put("/:id", (req, res) => {
  // TODO: Update seeker profile based on body payload
  res.json({ success: true, message: "Profile updated" });
});

// POST /api/seekers/:id/verify
router.post("/:id/verify", (req, res) => {
  // TODO: Admin verification of KYC and details
  res.json({ success: true, message: "Seeker verified successfully" });
});

export default router;
