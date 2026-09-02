/**
 * Database Architecture (Ref: BRD Pages 25-50)
 * This schema defines the structure for PostgreSQL/MySQL as requested in the specification.
 * It includes Master tables, Franchise Seeker tables, Brand tables, Smart Match tables, CRM, Payments, Notifications, CMS, and Admin tables.
 */

// Master Tables
export interface Users {
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "SUPER_ADMIN" | "FRANCHISE_SEEKER" | "BRAND_OWNER";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Franchise Seeker Tables
export interface SeekerProfile {
  userId: string; // FK to Users
  fullName: string;
  city: string;
  state: string;
  cityTier: "Tier 1" | "Tier 2" | "Tier 3";
  minInvestment: number;
  maxInvestment: number;
  businessBackground: string;
  experienceDescription: string;
  preferredIndustries: string[];
  preferredCities: string[];
  linkedInUrl?: string;
  isVerified: boolean;
}

// Brand Tables
export interface BrandProfile {
  userId: string; // FK to Users
  brandName: string;
  industry: string;
  tagline?: string;
  description: string;
  establishedYear: number;
  totalOutlets: number;
  minInvestmentRequired: number;
  maxInvestmentRequired: number;
  franchiseFee: number;
  spaceRequiredMin: number;
  spaceRequiredMax: number;
  cityTargets: string[];
  isVerified: boolean;
  featured: boolean;
}

export interface BrandSubscription {
  id: string;
  brandId: string;
  planName: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  unlocksTotal: number;
  unlocksRemaining: number;
  startDate: Date;
  endDate: Date;
}

export interface BrandSavedLeads {
  id: string;
  brandId: string;
  seekerId: string;
  savedAt: Date;
}

// Smart Match Engine Tables
export interface SmartMatchScore {
  id: string;
  seekerId: string;
  brandId: string;
  score: number;
  calculatedAt: Date;
}

// CRM Tables
export interface CRMLead {
  id: string;
  brandId: string;
  seekerId: string;
  status: "NEW" | "CONTACTED" | "MEETING_SCHEDULED" | "NEGOTIATING" | "CLOSED_WON" | "CLOSED_LOST";
  notes: string;
  nextFollowUp?: Date;
}

export interface CRMMeeting {
  id: string;
  brandId: string;
  seekerId: string;
  meetingDate: Date;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  meetingLink?: string;
}

// Payments Tables
export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  paymentGatewayId: string;
  createdAt: Date;
}
