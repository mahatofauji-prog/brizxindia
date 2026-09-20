import { Router } from "express";

const router = Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { role, email, password, phone } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  // TODO: Save to DB
  res.json({ success: true, message: "User registered successfully", userId: "new_user_123" });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  
  // Basic mock authentication
  if (email && password) {
    let mockRole = role || "FRANCHISE_SEEKER";
    if (email.includes("admin")) mockRole = "SUPER_ADMIN";
    else if (email.includes("brand")) mockRole = "BRAND_OWNER";
    
    res.json({ 
      success: true, 
      token: "mock_jwt_token", 
      user: { id: "1", role: mockRole, email } 
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", (req, res) => {
  const { otp, phone } = req.body;
  if (otp === "123456") {
    res.json({ success: true, message: "OTP verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", (req, res) => {
  res.json({ success: true, message: "Password reset link sent" });
});

export default router;
