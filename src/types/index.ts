export type Role = 'SUPER_ADMIN' | 'BRAND_OWNER' | 'FRANCHISE_SEEKER';
export type RegistrationStatus = 'DRAFT' | 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'draft' | 'pending' | 'approved' | 'rejected';

export type RejectionCategory = 
  | 'Incomplete Information'
  | 'Invalid Documents'
  | 'Business Verification Failed'
  | 'Financial Verification Failed'
  | 'Duplicate Application'
  | 'Eligibility Criteria Not Met'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  verified: boolean;
  phone?: string;
  brandId?: string;
  createdAt: string;
}

export interface SeekerDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'EMPTY';
  fileData?: string;
  notes?: string;
}

export interface FranchiseSeeker extends User {
  role: 'FRANCHISE_SEEKER';
  city: string;
  investment: number; // in Lakhs
  industry: string;
  experience: string; // Background
  timeline: string;
  matchScore?: number;
  savedBrandIds?: string[];
  preferredCities?: string[];
  preferredIndustries?: string[];
  businessBackground?: string;
  linkedInUrl?: string;
  isPremium?: boolean;
  featured?: boolean;
  bio?: string;
  whatsApp?: string;
  dob?: string;
  gender?: string;
  address?: string;
  state?: string;
  country?: string;
  pincode?: string;
  minInvestment?: number;
  maxInvestment?: number;
  availableCapital?: number;
  fundingSource?: string;
  franchiseType?: string;
  riskAppetite?: string;
  coverPhoto?: string;
  documents?: SeekerDocument[];

  // Registration & Application Workflow Fields
  emailVerificationStatus?: 'email_verified' | 'email_unverified';
  applicationStatus?: RegistrationStatus;
  rejectionReason?: string;
  rejectionCategory?: RejectionCategory;
  verifiedAt?: string;
  reviewedBy?: string;
  completionPercentage?: number;
  submittedAt?: string;
  hasBusinessExperience?: boolean;
  businessExperienceDetails?: string;
  hasFranchiseExperience?: boolean;
  franchiseExperienceDetails?: string;
  occupation?: string;
  preferredFranchiseModel?: string;
  investmentRiskAppetite?: 'Low' | 'Moderate' | 'High';
  entrepreneurshipVision?: string;
}

export interface BrandDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  fileData?: string;
  notes?: string;
}

export interface Brand extends User {
  role: 'BRAND_OWNER';
  brandName: string;
  tagline?: string;
  description?: string;
  industry: string;
  investmentRequired: {
    min: number;
    max: number;
  };
  minInvestment?: number;
  maxInvestment?: number;
  franchiseFee?: number; // Lakhs
  royaltyFee?: string;
  royalty?: string;
  spaceRequired?: string;
  roiPayback?: string;
  paybackPeriod?: string;
  logo?: string;
  coverImage?: string;
  galleryImages?: string[];
  website?: string;
  totalOutlets?: number;
  outlets?: number;
  cityTargets?: string[];
  city?: string;
  establishedYear?: number;
  established?: number;
  
  // Public Profile Fields
  fullAbout?: string;
  targetCustomer?: string;
  expansionOpportunity?: string;
  businessModel?: string;
  keyAdvantages?: string[];
  contactPhone?: string;
  contactEmail?: string;
  badge?: string;
  rating?: number;
  featured?: boolean;
  subscriptionTier: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  unlockedLeads: string[]; // Seeker IDs
  savedLeads: string[];
  billingDetails?: BrandBillingDetails;

  // Registration & Application Workflow Fields
  brandOrigin?: 'existing' | 'new_registration';
  gstin?: string;
  mcaCin?: string;
  trademarkNumber?: string;
  emailVerificationStatus?: 'email_verified' | 'email_unverified';
  applicationStatus?: RegistrationStatus;
  rejectionReason?: string;
  rejectionCategory?: RejectionCategory;
  verifiedAt?: string;
  reviewedBy?: string;
  completionPercentage?: number;
  submittedAt?: string;
  companyName?: string;
  contactPerson?: string;
  whatsappNumber?: string;
  fullDescription?: string;
  headquarters?: string;
  expansionPlans?: string;
  supportProvided?: string[];
  trainingDetails?: string;
  marketingSupport?: string;
  documents?: BrandDocument[];
}

export interface BrandBillingDetails {
  legalEntityName: string;
  billingEmail: string;
  billingPhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string; // e.g. "Karnataka", "Maharashtra", "Delhi"
  stateCode: string; // e.g. "29", "27", "07"
  pincode: string;
  gstin?: string; // 15 chars e.g. 29AABCB1234F1Z5
  gstinVerified: boolean;
  panNumber?: string;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  badge?: string;
  perCreditPrice: number;
  description: string;
}

export interface CRMNote {
  id: string;
  brandId: string;
  seekerId: string;
  text: string;
  createdAt: string;
}

export type LeadStage = 'NEW' | 'CONTACTED' | 'MEETING_SCHEDULED' | 'NEGOTIATING' | 'LOI_SIGNED' | 'CONVERTED' | 'LOST';

export interface CRMLeadRecord {
  seekerId: string;
  brandId: string;
  stage: LeadStage;
  tags?: string[];
  updatedAt: string;
}

export interface CRMTask {
  id: string;
  brandId: string;
  seekerId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
}

export type InvoicePaymentStatus = 'SUCCESS' | 'PAID' | 'PENDING' | 'FAILED' | 'REFUND_REQUESTED' | 'REFUND_PROCESSING' | 'REFUNDED';

export interface PaymentInvoice {
  id: string;
  brandId: string;
  brandName?: string;
  invoiceNumber?: string;
  planName: string;
  itemType?: 'SUBSCRIPTION' | 'CREDIT_PACK' | 'RENEWAL';
  creditsAdded?: number;
  amount: number; // Taxable Amount (Base Price)
  gstType?: 'INTRA_STATE' | 'INTER_STATE';
  cgstRate?: number; // 9%
  cgstAmount?: number;
  sgstRate?: number; // 9%
  sgstAmount?: number;
  igstRate?: number; // 18%
  igstAmount?: number;
  gstAmount: number; // Total GST Amount
  totalAmount: number; // Base + GST
  paymentMode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD';
  paymentId?: string;
  orderId?: string;
  transactionId?: string;
  status: InvoicePaymentStatus;
  date: string;
  sacCode?: string; // 998314
  invoiceUrl?: string;
  billingDetailsSnapshot?: BrandBillingDetails;
  refundDetails?: {
    refundId: string;
    reason: string;
    requestedAt: string;
    processedAt?: string;
    refundAmount: number;
    creditsDeducted?: number;
    status: 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
    notes?: string;
  };
}


export interface Meeting {
  id?: string;
  meetingId?: string;
  seekerId: string;
  seekerName?: string;
  brandId: string;
  brandName: string;
  brandOwnerId?: string;
  brandOwnerName?: string;
  requestedDate?: string;
  requestedTime?: string;
  meetingPurpose?: string;
  seekerMessage?: string;
  meetingMode?: 'Google Meet' | 'Phone' | 'In-person' | 'Other';
  meetingLink?: string;
  status: MeetingStatus;
  createdAt?: string;
  updatedAt?: string;
  rescheduleRequestedBy?: 'SEEKER' | 'BRAND';
  rescheduleReason?: string;
  rejectionReason?: string;
  cancelledBy?: 'SEEKER' | 'BRAND';
  cancellationReason?: string;
  date?: string;
  time?: string;
  location?: string;
  notes?: string;
}

export type MeetingStatus = 
  | 'PENDING'
  | 'PENDING_BRAND_RESPONSE' 
  | 'CONFIRMED' 
  | 'RESCHEDULE_REQUESTED' 
  | 'RESCHEDULED' 
  | 'REJECTED' 
  | 'CANCELLED'
  | 'CANCELLED_BY_SEEKER' 
  | 'CANCELLED_BY_BRAND' 
  | 'MEETING_STARTED' 
  | 'COMPLETED' 
  | 'NO_SHOW_SEEKER' 
  | 'NO_SHOW_BRAND'
  | 'AWAITING_COMPLETION_CONFIRMATION';

export interface Subscription {
  id: string;
  brandId: string;
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  unlocksRemaining: number;
  totalUnlocks?: number;
}

export interface AuditLog {
  logId: string;
  meetingId: string;
  actorId: string;
  actorRole: string;
  action: string;
  oldStatus?: string;
  newStatus?: string;
  timestamp: string;
  reason?: string;
}

export type BrandVerificationStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'DOCUMENTS_REQUIRED'
  | 'VERIFICATION_IN_PROGRESS'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export interface VerificationCheck {
  checkId: string;
  requestId: string;
  checkType: 'MCA_REGISTRATION' | 'TRADEMARK_STATUS' | 'GST_FILINGS' | 'FRANCHISE_AGREEMENT_FDD' | 'UNIT_ECONOMICS_AUDIT' | 'LITIGATION_SEARCH';
  checkName: string;
  description: string;
  status: 'PENDING' | 'PASSED' | 'FAILED' | 'NOT_APPLICABLE';
  reviewerId?: string;
  notes?: string;
  evidenceReferences?: string;
  reviewedAt?: string;
}

export interface VerificationDocument {
  documentId: string;
  requestId: string;
  uploadedBy: string; // userId
  documentType: 'GST_CERTIFICATE' | 'INCORPORATION_CERTIFICATE' | 'TRADEMARK_CERT' | 'FDD_AGREEMENT' | 'AUDITED_FINANCIALS' | 'OTHER';
  documentTypeName: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  storagePath: string; // Base64 simulated secure link or file reference
  status: 'UPLOADED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  reviewerNote?: string;
  uploadedAt: string;
  reviewedAt?: string;
}

export interface VerificationAuditLog {
  logId: string;
  requestId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string; // e.g. 'SUBMITTED', 'STATUS_CHANGE', 'DOCUMENT_UPLOADED', 'CHECK_PASSED'
  previousStatus?: string;
  newStatus?: string;
  note?: string;
  timestamp: string;
}

export interface LegalAdvisorQuestion {
  id: string;
  seekerId: string;
  seekerName: string;
  question: string;
  answer?: string;
  advisorName?: string;
  status: 'OPEN' | 'IN_REVIEW' | 'ANSWERED' | 'CLOSED';
  submittedAt: string;
  answeredAt?: string;
  category?: string;
}

export interface BrandVerificationRequest {
  id: string; // BRZX-AUD-YYYY-XXXX
  seekerId: string;
  brandName: string;
  website?: string;
  contactPhone?: string;
  contactEmail?: string;
  category?: string;
  status: BrandVerificationStatus;
  submittedAt: string;
  updatedAt: string;
  notes?: string;
  registrationNumber?: string;
  gstin?: string;
  mcaCin?: string;
  trademarkNumber?: string;
  additionalNotes?: string;
  assignedVerifierId?: string;
  assignedVerifierName?: string;
  consentAccepted: boolean;
  verifiedAt?: string;
  expiresAt?: string;
  rejectionReason?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SYSTEM' | 'MEETING' | 'PAYMENT' | 'PROMOTIONAL' | 'APPLICATION';
  read: boolean;
  createdAt: string;
  timestamp?: string;
  applicationId?: string;
  linkUrl?: string;
}

export type ConnectionStatus = 
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'REQUEST_SENT' 
  | 'AWAITING_RESPONSE' 
  | 'BRAND_REVIEWING' 
  | 'CONNECTED' 
  | 'CLOSED';

export interface ConnectionRequest {
  id: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  seekerPhone?: string;
  brandId: string;
  brandName: string;
  brandLogo?: string;
  brandEmail?: string;
  brandPhone?: string;
  brandLocation?: string;
  brandIndustry?: string;
  brandInvestmentRequirement?: string;
  industry: string;
  investmentRequired: string;
  expectedPayback?: string;
  activeOutlets?: number;
  matchScore: number;
  targetSector: string;
  availableInvestment: string;
  preferredLocation: string;
  status: ConnectionStatus;
  whyMatched: string[];
  notes?: string;
  readByOwner?: boolean;
  internalNotes?: string[];
  initiatedBy?: string; // Full name of the initiator
  initiatorType?: 'SEEKER' | 'BRAND';
  connectionDate?: string;
  connectionTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailLog {
  id: string;
  applicationId: string;
  userId?: string;
  recipient: string;
  applicantName: string;
  applicationType: 'BRAND' | 'SEEKER';
  emailType: string;
  subject: string;
  message: string;
  body?: string;
  sentByAdmin: string;
  sentAt: string;
  status: 'SUCCESS' | 'FAILED';
  errorDetails?: string;
  deliveryStatus?: string;
}

export type ApplicationStatus = 'DRAFT' | 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEW' | 'CONTACTED';

export interface FranchiseApplication {
  id: string; // applicationId
  brandId: string;
  brandName: string;
  seekerId?: string;
  applicantName: string;
  mobile: string;
  email: string;
  whatsApp?: string;
  city: string;
  state: string;
  investmentBudget: string;
  availableCapital?: string;
  preferredLocation: string;
  occupation?: string;
  businessExperience?: string;
  franchiseType?: string;
  message?: string;
  submittedAt: string;
  status: ApplicationStatus;
  assignedBrandOwnerId?: string;
  notes?: string;
  verifiedAt?: string;
  reviewedBy?: string;
  rejectionCategory?: RejectionCategory;
  rejectionReason?: string;
  smartMatchScore?: number;
  matchBreakdown?: any;
}

export type AnalyticsEventType = 
  | 'SEEKER_SEARCH' 
  | 'PROFILE_VIEW' 
  | 'CONTACT_UNLOCKED' 
  | 'FIRST_CONTACT' 
  | 'WHATSAPP_CLICK' 
  | 'PHONE_CLICK' 
  | 'EMAIL_CLICK' 
  | 'MEETING_SCHEDULED' 
  | 'MEETING_COMPLETED' 
  | 'FRANCHISE_DISCUSSION' 
  | 'DEAL_CLOSED';

export interface AnalyticsEvent {
  id: string;
  brandId: string;
  seekerId?: string;
  eventType: AnalyticsEventType;
  timestamp: string;
  matchScore?: number;
  city?: string;
  industry?: string;
  investment?: number;
  metadata?: Record<string, any>;
  createdAt: string;
}



