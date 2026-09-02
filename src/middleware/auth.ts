import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const brandHeader = req.headers['x-brand-id'] as string;
  const userHeader = req.headers['x-user-id'] as string;
  const userRole = (req.headers['x-user-role'] as string) || 'BRAND_OWNER';

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (token === "mock_jwt_token" || token.startsWith("admin_")) {
      (req as any).user = { id: "admin1", role: "SUPER_ADMIN" };
      return next();
    } else if (token.startsWith("brand_") || token.startsWith("b")) {
      const bId = token.startsWith("brand_") ? token.replace("brand_", "") : token;
      (req as any).user = { id: bId, brandId: bId, role: "BRAND_OWNER" };
      return next();
    } else if (token.startsWith("seeker_") || token.startsWith("s")) {
      const sId = token.startsWith("seeker_") ? token.replace("seeker_", "") : token;
      (req as any).user = { id: sId, role: "FRANCHISE_SEEKER" };
      return next();
    } else if (token) {
      (req as any).user = { id: token, brandId: brandHeader || token, role: userRole };
      return next();
    }
  }

  // Fallback to explicit brand or user header in client requests
  if (brandHeader) {
    (req as any).user = { id: brandHeader, brandId: brandHeader, role: userRole || "BRAND_OWNER" };
    return next();
  }

  if (userHeader) {
    (req as any).user = { id: userHeader, role: userRole || "FRANCHISE_SEEKER" };
    return next();
  }
  
  return res.status(401).json({ success: false, message: "Unauthorized. Missing authentication token." });
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Insufficient privileges" });
    }
    next();
  };
};
