import { Router } from "express";

const router = Router();

// 11. Notification APIs

// GET /api/notifications
router.get("/", (req, res) => {
  res.json({ success: true, data: [] });
});

// PUT /api/notifications/:id/read
router.put("/:id/read", (req, res) => {
  res.json({ success: true, message: "Notification marked as read" });
});

// POST /api/notifications/send
router.post("/send", (req, res) => {
  res.json({ success: true, message: "Notification sent" });
});

export default router;
