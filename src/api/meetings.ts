import { Router } from "express";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

// 8. Meeting APIs

// POST /api/meetings/schedule
router.post("/schedule", (req, res) => {
  const { brandId, seekerId, date, time, message } = req.body;
  if (!brandId || !seekerId || !date || !time) {
    return res.status(400).json({ success: false, message: "Missing meeting details" });
  }
  
  res.json({ success: true, message: "Meeting scheduled", meetingId: "mtg_" + Date.now() });
});

// GET /api/meetings
router.get("/", (req, res) => {
  res.json({ success: true, data: [
    { id: "mtg_1", brandId: "b1", seekerId: "s1", date: new Date(), status: "CONFIRMED" }
  ] });
});

// PUT /api/meetings/:id/status
router.put("/:id/status", (req, res) => {
  const { status } = req.body;
  const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }
  
  res.json({ success: true, message: "Meeting status updated to " + status });
});

export default router;
