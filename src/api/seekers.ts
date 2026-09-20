import { Router } from "express";
import { requireAuth } from "../middleware/auth";

const router = Router();

// All Seeker APIs require authentication
router.use(requireAuth);

// 3. Franchise Seeker APIs

// GET /api/seekers
router.get("/", (req, res) => {
  // Return paginated and filtered list of franchise seekers
  res.json({ success: true, data: [] });
});

// GET /api/seekers/:id
router.get("/:id", (req, res) => {
  // Return detailed profile of a specific seeker
  res.json({ success: true, data: { id: req.params.id, name: "Sample Seeker" } });
});

// PUT /api/seekers/:id
router.put("/:id", (req, res) => {
  // Update seeker profile based on body payload
  res.json({ success: true, message: "Profile updated" });
});

// POST /api/seekers/:id/verify
router.post("/:id/verify", (req, res) => {
  // Admin verification of KYC and details
  res.json({ success: true, message: "Seeker verified successfully" });
});

export default router;
