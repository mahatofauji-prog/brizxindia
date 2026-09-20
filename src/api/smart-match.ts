import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// POST /api/smart-match/calculate
router.post("/calculate", requireAuth, (req, res) => {
  const { seekerInvestment, brandInvestment, seekerCity, brandCities, seekerIndustry, brandIndustry } = req.body;
  
  let score = 0;
  
  // 1. Investment Match (40%)
  if (seekerInvestment >= brandInvestment) {
    score += 40;
  } else if (seekerInvestment >= brandInvestment * 0.8) {
    score += 20; // Partial match if within 80%
  }

  // 2. City Match (30%)
  if (brandCities && brandCities.includes(seekerCity)) {
    score += 30;
  }

  // 3. Industry Match (30%)
  if (seekerIndustry === brandIndustry) {
    score += 30;
  }
  
  res.json({ 
    success: true, 
    message: "Match calculated", 
    score,
    factors: {
      investmentMatch: seekerInvestment >= brandInvestment,
      cityMatch: brandCities && brandCities.includes(seekerCity),
      industryMatch: seekerIndustry === brandIndustry
    }
  });
});

// GET /api/smart-match/history
router.get("/history", requireAuth, (req, res) => {
  res.json({ success: true, data: [
    { id: "1", brandName: "KFC", score: 90, date: new Date() },
    { id: "2", brandName: "Subway", score: 75, date: new Date() }
  ] });
});

// GET /api/smart-match/recommendations
router.get("/recommendations", requireAuth, (req, res) => {
  res.json({ success: true, data: [
    { brandId: "b1", brandName: "Domino's", matchScore: 95, reason: "Excellent investment and location match" },
    { brandId: "b2", brandName: "Burger King", matchScore: 88, reason: "Good industry and investment match" }
  ] });
});

export default router;
