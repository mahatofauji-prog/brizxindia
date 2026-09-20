import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// 8. CRM APIs - Only brands and admins
router.use(requireAuth, requireRole(["BRAND_OWNER", "SUPER_ADMIN"]));

// GET /api/crm/leads
router.get("/leads", (req, res) => {
  res.json({ success: true, data: [
    { id: "lead1", seekerName: "Rajesh Kumar", status: "NEW", date: new Date() },
    { id: "lead2", seekerName: "Amit Singh", status: "CONTACTED", date: new Date() }
  ] });
});

// POST /api/crm/leads/:id/notes
router.post("/leads/:id/notes", (req, res) => {
  const { note } = req.body;
  if (!note) return res.status(400).json({ success: false, message: "Note is required" });
  
  res.json({ success: true, message: "Note added successfully", note: { text: note, date: new Date() } });
});

// PUT /api/crm/leads/:id/status
router.put("/leads/:id/status", (req, res) => {
  const { status } = req.body;
  const validStatuses = ["NEW", "CONTACTED", "MEETING_SCHEDULED", "NEGOTIATING", "CLOSED_WON", "CLOSED_LOST"];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }
  
  res.json({ success: true, message: "Pipeline status updated to " + status });
});

// GET /api/crm/meetings
router.get("/meetings", (req, res) => {
  res.json({ success: true, data: [
    { id: "m1", title: "Introductory Call with Rajesh", date: new Date(), status: "CONFIRMED" }
  ] });
});

export default router;
