import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// API Routers
import authRouter from "./src/api/auth";
import seekerRouter from "./src/api/seekers";
import brandRouter from "./src/api/brands";
import crmRouter from "./src/api/crm";
import adminRouter from "./src/api/admin";
import smartMatchRouter from "./src/api/smart-match";
import subscriptionsRouter from "./src/api/subscriptions";
import paymentsRouter from "./src/api/payments";
import meetingsRouter from "./src/api/meetings";
import cmsRouter from "./src/api/cms";
import notificationsRouter from "./src/api/notifications";
import analyticsRouter from "./src/api/analytics";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with increased limit to support base64 uploads
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve uploads folder statically
  app.use("/uploads", express.static(uploadsDir));

  // Serve static assets from public directory directly (essential for development and images)
  app.use(express.static(path.join(process.cwd(), "public")));

  // Base64 file upload endpoint
  app.post("/api/upload", (req, res) => {
    try {
      const { fileName, fileData, userId } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "Missing file data" });
      }

      // Extract raw base64 data (strip data:image/png;base64, etc.)
      const base64Marker = ";base64,";
      let base64Data = fileData;
      if (fileData.includes(base64Marker)) {
        base64Data = fileData.split(base64Marker)[1];
      }

      const buffer = Buffer.from(base64Data, "base64");
      
      // Ensure folder isolation/security: prepend userId and timestamp to prevent overwriting
      const safeUserId = String(userId || "anonymous").replace(/[^a-zA-Z0-9_-]/g, "");
      const cleanFileName = String(fileName || "file").replace(/[^a-zA-Z0-9_.-]/g, "_");
      const uniqueFileName = `${safeUserId}_${Date.now()}_${cleanFileName}`;
      
      const filePath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);

      console.log(`[Server Upload] Successfully saved file: ${uniqueFileName}`);

      // Return permanent relative URL
      res.json({ url: `/uploads/${uniqueFileName}` });
    } catch (err: any) {
      console.error("[Server Upload] Error:", err);
      res.status(500).json({ error: err.message || "Failed to save file on server" });
    }
  });

  // Mount API Routes (as per BRD Page 25-70 instructions)
  app.use("/api/auth", authRouter);
  app.use("/api/seekers", seekerRouter);
  app.use("/api/brands", brandRouter);
  app.use("/api/crm", crmRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/smart-match", smartMatchRouter);
  app.use("/api/subscriptions", subscriptionsRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/meetings", meetingsRouter);
  app.use("/api/cms", cmsRouter);
  app.use("/api/notifications", notificationsRouter);
  app.use("/api/analytics", analyticsRouter);

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "BrizX India API is running" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4 (which is what we have)
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
