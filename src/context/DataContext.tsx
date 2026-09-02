import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  FranchiseSeeker, Brand, BrandBillingDetails, CRMNote, Meeting, Subscription, BrandVerificationRequest, 
  NotificationItem, LeadStage, CRMLeadRecord, CRMTask, PaymentInvoice, ConnectionRequest, 
  ConnectionStatus, EmailLog, FranchiseApplication, ApplicationStatus,
  BrandVerificationStatus, VerificationCheck, VerificationDocument, VerificationAuditLog, LegalAdvisorQuestion,
  AuditLog, MeetingStatus, AnalyticsEvent, AnalyticsEventType
} from '../types';
import { mockSeekers, mockBrands, mockVerificationRequests, mockNotifications } from '../data/mockDb';
import { initialMockAnalyticsEvents } from '../utils/analyticsEngine';
import { calculateBrandSeekerMatch } from '../utils/SmartMatchEngine';
import { calculateGstBreakdown, CREDIT_PACKS, SUBSCRIPTION_PLANS } from '../utils/gstInvoiceEngine';

const initialMockApplications: FranchiseApplication[] = [
  {
    id: 'app_101',
    brandId: 'b1',
    brandName: 'Burger Kingsway',
    applicantName: 'Vikram Mehta',
    mobile: '+91 98112 34567',
    email: 'vikram.mehta@gmail.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    investmentBudget: '₹25-30 Lakhs',
    preferredLocation: 'Koramangala / HSR Layout',
    occupation: 'Ex-IT Senior Operations Manager',
    businessExperience: 'Managed tech retail outlets for 4 years',
    message: 'I have a prime 450 sq ft property on Koramangala 80ft road ready for immediate QSR conversion.',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'NEW'
  },
  {
    id: 'app_102',
    brandId: 'b2',
    brandName: 'Chai Point Express',
    applicantName: 'Sunita Rao',
    mobile: '+91 99001 88776',
    email: 'sunita.rao@outlook.com',
    city: 'Hyderabad',
    state: 'Telangana',
    investmentBudget: '₹10-15 Lakhs',
    preferredLocation: 'HITEC City Metro Station',
    occupation: 'Business Consultant',
    businessExperience: 'Franchisee owner of stationery outlet',
    message: 'Looking for a high footfall kiosk location inside HITEC city IT hub.',
    submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'CONTACTED'
  },
  {
    id: 'app_103',
    brandId: 'b3',
    brandName: 'Apollo HealthHub Diagnostics',
    applicantName: 'Dr. Alok Verma',
    mobile: '+91 97171 22334',
    email: 'dr.alok@healthplus.org',
    city: 'Mumbai',
    state: 'Maharashtra',
    investmentBudget: '₹50-60 Lakhs',
    preferredLocation: 'Andheri West',
    occupation: 'Pathologist & Physician',
    businessExperience: '12 years running local polyclinic',
    message: 'Interested in setting up an Apollo accredited diagnostic hub with home sample collection network.',
    submittedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    status: 'UNDER_REVIEW'
  }
];

const initialMockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'cr_101',
    seekerId: 's1',
    seekerName: 'Rohan Sharma',
    seekerEmail: 'rohan.sharma@example.com',
    seekerPhone: '+91 98765 43210',
    brandId: 'b1',
    brandName: 'Burger Kingsway',
    brandLogo: '/file_00000000f5988211884f7bce5b4acfc8~2.jpg',
    brandEmail: 'franchise@burgerkingsway.in',
    brandPhone: '+91 99999 77777',
    brandLocation: 'Gurugram, Haryana',
    brandIndustry: 'Food & Beverages',
    brandInvestmentRequirement: '₹15–30 Lakhs',
    industry: 'Food & Beverages',
    investmentRequired: '₹15–30 Lakhs',
    expectedPayback: '12–18 Months',
    activeOutlets: 120,
    matchScore: 93,
    targetSector: 'Food & Beverages',
    availableInvestment: '₹25 Lakhs',
    preferredLocation: 'Bengaluru / Outer Ring Road',
    status: 'REQUEST_SENT',
    whyMatched: [
      'Your investment capacity fits the required range (₹15-30 Lakhs)',
      'Your selected industry matches Food & Beverages',
      'The franchise is available for your preferred location in Bengaluru',
      'Strong compatibility with your high-footfall QSR preferences'
    ],
    notes: 'Inquired from Home AI Match card. Excited about QSR expansion.',
    initiatedBy: 'Rohan Sharma',
    initiatorType: 'SEEKER',
    connectionDate: 'August 27, 2026',
    connectionTime: '11:30 AM',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'cr_102',
    seekerId: 's1',
    seekerName: 'Rohan Sharma',
    seekerEmail: 'rohan.sharma@example.com',
    seekerPhone: '+91 98765 43210',
    brandId: 'b2',
    brandName: 'Chai Point Express',
    brandLogo: '/file_00000000f5988211884f7bce5b4acfc8~2.jpg',
    brandEmail: 'partner@chaipointexpress.in',
    brandPhone: '+91 88888 55555',
    brandLocation: 'Bengaluru, Karnataka',
    brandIndustry: 'Food & Beverages',
    brandInvestmentRequirement: '₹10–20 Lakhs',
    industry: 'Food & Beverages',
    investmentRequired: '₹10–20 Lakhs',
    expectedPayback: '10–14 Months',
    activeOutlets: 85,
    matchScore: 88,
    targetSector: 'Food & Beverages',
    availableInvestment: '₹25 Lakhs',
    preferredLocation: 'Bengaluru',
    status: 'BRAND_REVIEWING',
    whyMatched: [
      'Capital budget matches Chai Point franchise fee and capex',
      'Preferred location aligns with expansion strategy'
    ],
    initiatedBy: 'Rohan Sharma',
    initiatorType: 'SEEKER',
    connectionDate: 'August 24, 2026',
    connectionTime: '04:15 PM',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

interface DataContextType {
  seekers: FranchiseSeeker[];
  brands: Brand[];
  crmNotes: CRMNote[];
  meetings: Meeting[];
  subscriptions: Subscription[];
  verificationRequests: BrandVerificationRequest[];
  verificationDocuments: VerificationDocument[];
  verificationChecks: VerificationCheck[];
  verificationAuditLogs: VerificationAuditLog[];
  legalAdvisorQuestions: LegalAdvisorQuestion[];
  notifications: NotificationItem[];
  leadStages: CRMLeadRecord[];
  crmTasks: CRMTask[];
  invoices: PaymentInvoice[];
  connectionRequests: ConnectionRequest[];
  applications: FranchiseApplication[];
  emailLogs: EmailLog[];
  simulateEmailFailure: boolean;
  setSimulateEmailFailure: (val: boolean) => void;
  clearEmailLogs: () => void;
  analyticsEvents: AnalyticsEvent[];
  logAnalyticsEvent: (event: Omit<AnalyticsEvent, 'id' | 'createdAt'>) => void;
  recordLeadContactAction: (brandId: string, seekerId: string, channel: 'WHATSAPP' | 'PHONE' | 'EMAIL') => void;
  updateSeeker: (id: string, data: Partial<FranchiseSeeker>) => void;
  updateBrand: (id: string, data: Partial<Brand>) => Promise<void> | void;
  addCRMNote: (note: Omit<CRMNote, 'id' | 'createdAt'>) => void;
  unlockLead: (brandId: string, seekerId: string) => void;
  toggleSaveLeadForBrand: (brandId: string, seekerId: string) => void;
  updateLeadStage: (brandId: string, seekerId: string, stage: LeadStage) => void;
  addCRMTask: (task: Omit<CRMTask, 'id' | 'createdAt' | 'completed'>) => void;
  toggleCRMTask: (taskId: string) => void;
  auditLogs: AuditLog[];
  scheduleMeeting: (meeting: Omit<Meeting, 'meetingId' | 'createdAt' | 'updatedAt'>) => void;
  cancelMeeting: (meetingId: string) => void;
  updateMeetingStatus: (meetingId: string, status: MeetingStatus, actorId: string, actorRole: string, reason?: string) => void;
  addMeetingAuditLog: (log: Omit<AuditLog, 'logId' | 'timestamp'>) => void;
  verifySeeker: (id: string) => void;
  toggleSaveBrand: (seekerId: string, brandId: string) => void;
  addVerificationRequest: (req: Omit<BrandVerificationRequest, 'id' | 'submittedAt' | 'updatedAt' | 'status' | 'consentAccepted'>) => void;
  updateVerificationRequest: (id: string, data: Partial<BrandVerificationRequest>, actorId: string, actorName: string, actorRole: string) => void;
  uploadVerificationDocument: (requestId: string, docType: VerificationDocument['documentType'], docTypeName: string, fileName: string, fileSize: string, fileData: string, uploadedBy: string) => void;
  reviewVerificationDocument: (docId: string, status: 'ACCEPTED' | 'REJECTED', reviewerNote: string, reviewerId: string, reviewerName: string) => void;
  updateVerificationCheck: (checkId: string, status: VerificationCheck['status'], notes: string, evidence: string, reviewerId: string, reviewerName: string) => void;
  askLegalAdvisor: (seekerId: string, question: string, seekerName: string) => void;
  answerLegalAdvisor: (questionId: string, answer: string, advisorName: string) => void;
  markNotificationRead: (id: string) => void;
  markNotificationAsRead?: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearNotification?: (id: string) => void;
  clearAllNotifications: (userId: string) => void;
  updateBrandProfile?: (id: string, data: Partial<Brand>) => void;
  updateBrandBillingDetails: (brandId: string, billing: BrandBillingDetails) => void;
  upgradeSeekerToPremium: (seekerId: string) => void;
  renewSubscription: (brandId: string, plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE', unlocks: number, price: number, mode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING') => void;
  buyCreditPackPayment: (brandId: string, packId: string, mode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD', paymentRef?: string) => Promise<PaymentInvoice>;
  processSubscriptionPayment: (brandId: string, planName: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE', mode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD', paymentRef?: string) => Promise<PaymentInvoice>;
  requestInvoiceRefund: (invoiceId: string, reason: string) => Promise<boolean>;
  addConnectionRequest: (req: Omit<ConnectionRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: ConnectionStatus }) => ConnectionRequest;
  updateConnectionStatus: (requestId: string, status: ConnectionStatus) => void;
  hasConnectionRequest: (seekerId: string, brandId: string) => ConnectionRequest | undefined;
  markConnectionReadByOwner: (requestId: string) => void;
  addConnectionInternalNote: (requestId: string, note: string) => void;
  addApplication: (appData: Omit<FranchiseApplication, 'id' | 'submittedAt' | 'status'>) => FranchiseApplication;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  getApplicationsForBrand: (brandId: string) => FranchiseApplication[];
  sendApplicationEmail: (emailData: Omit<EmailLog, 'id' | 'sentAt'>) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [seekers, setSeekers] = useState<FranchiseSeeker[]>(() => {
    const saved = localStorage.getItem('brizx_seekers');
    return saved ? JSON.parse(saved) : mockSeekers;
  });

  useEffect(() => {
    localStorage.setItem('brizx_seekers', JSON.stringify(seekers));
  }, [seekers]);

  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem('brizx_brands');
    const loadedBrands: Brand[] = saved ? JSON.parse(saved) : mockBrands;
    return loadedBrands.map(b => {
      const origin = b.brandOrigin || 'existing';
      return {
        ...b,
        brandOrigin: origin,
        verified: origin === 'existing' ? (b.verified !== undefined ? b.verified : true) : b.verified,
        applicationStatus: origin === 'existing' ? (b.applicationStatus || 'APPROVED') : (b.applicationStatus || 'PENDING_REVIEW')
      };
    });
  });

  useEffect(() => {
    try {
      localStorage.setItem('brizx_brands', JSON.stringify(brands));
    } catch (e) {
      console.warn('Failed to save brands to localStorage', e);
    }
  }, [brands]);

  // Firestore Brands Sync
  useEffect(() => {
    let unsubscribe: () => void;
    async function syncFirestoreBrands() {
      try {
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        unsubscribe = onSnapshot(collection(db, 'brands'), (snapshot) => {
          if (!snapshot.empty) {
            const firestoreBrands: Brand[] = [];
            snapshot.forEach(docSnap => {
              const data = docSnap.data();
              const origin = data.brandOrigin || 'existing';
              firestoreBrands.push({ 
                id: docSnap.id, 
                ...data,
                brandOrigin: origin,
                verified: origin === 'existing' ? (data.verified !== undefined ? data.verified : true) : data.verified,
                applicationStatus: origin === 'existing' ? (data.applicationStatus || 'APPROVED') : (data.applicationStatus || 'PENDING_REVIEW')
              } as Brand);
            });
            setBrands(prev => {
              const map = new Map<string, Brand>();
              prev.forEach(b => map.set(b.id, b));
              firestoreBrands.forEach(b => {
                const existing = map.get(b.id);
                map.set(b.id, existing ? { ...existing, ...b } : b);
              });
              return Array.from(map.values());
            });
          }
        }, (err) => {
          console.warn('Firestore brands listener warning:', err);
        });
      } catch (err) {
        console.warn('Error setting up Firestore brands listener:', err);
      }
    }
    syncFirestoreBrands();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  
  // Brand Analytics Events State & Persistence
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() => {
    const saved = localStorage.getItem('brizx_analytics_events');
    return saved ? JSON.parse(saved) : initialMockAnalyticsEvents;
  });

  useEffect(() => {
    try {
      localStorage.setItem('brizx_analytics_events', JSON.stringify(analyticsEvents));
    } catch (e) {
      console.warn('Failed to save analytics events to localStorage', e);
    }
  }, [analyticsEvents]);

  const logAnalyticsEvent = (event: Omit<AnalyticsEvent, 'id' | 'createdAt'>) => {
    const newEvent: AnalyticsEvent = {
      ...event,
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      timestamp: event.timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setAnalyticsEvents(prev => [newEvent, ...prev]);
  };

  const recordLeadContactAction = (brandId: string, seekerId: string, channel: 'WHATSAPP' | 'PHONE' | 'EMAIL') => {
    const clickEventType: AnalyticsEventType = channel === 'WHATSAPP' ? 'WHATSAPP_CLICK' : channel === 'PHONE' ? 'PHONE_CLICK' : 'EMAIL_CLICK';
    const seeker = seekers.find(s => s.id === seekerId);
    const brand = brands.find(b => b.id === brandId);
    const score = brand && seeker ? calculateBrandSeekerMatch(brand, seeker).totalScore : (seeker?.matchScore || 90);
    const nowIso = new Date().toISOString();

    // 1. Log the click event
    const clickEvent: AnalyticsEvent = {
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      brandId,
      seekerId,
      eventType: clickEventType,
      timestamp: nowIso,
      matchScore: score,
      city: seeker?.city,
      industry: seeker?.industry,
      investment: seeker?.investment,
      metadata: { channel },
      createdAt: nowIso
    };

    // 2. Check if FIRST_CONTACT already exists for (brandId, seekerId)
    const existingFirstContact = analyticsEvents.find(e => e.brandId === brandId && e.seekerId === seekerId && e.eventType === 'FIRST_CONTACT');

    let firstContactEvent: AnalyticsEvent | null = null;
    if (!existingFirstContact) {
      const unlockEvt = analyticsEvents.find(e => e.brandId === brandId && e.seekerId === seekerId && e.eventType === 'CONTACT_UNLOCKED');
      let durationHours = 0.5;
      if (unlockEvt) {
        const unlockMs = new Date(unlockEvt.timestamp).getTime();
        const contactMs = new Date(nowIso).getTime();
        durationHours = Math.max(0.01, Number(((contactMs - unlockMs) / (1000 * 60 * 60)).toFixed(2)));
      }

      firstContactEvent = {
        id: 'evt_fc_' + Math.random().toString(36).substr(2, 9),
        brandId,
        seekerId,
        eventType: 'FIRST_CONTACT',
        timestamp: nowIso,
        matchScore: score,
        city: seeker?.city,
        industry: seeker?.industry,
        investment: seeker?.investment,
        metadata: { channel, durationHours },
        createdAt: nowIso
      };

      // Also automatically advance CRM stage to CONTACTED if currently in NEW stage
      setLeadStages(prev => {
        const existing = prev.find(l => l.brandId === brandId && l.seekerId === seekerId);
        if (!existing || existing.stage === 'NEW') {
          if (existing) {
            return prev.map(l => l.brandId === brandId && l.seekerId === seekerId ? { ...l, stage: 'CONTACTED', updatedAt: nowIso } : l);
          } else {
            return [...prev, { brandId, seekerId, stage: 'CONTACTED', updatedAt: nowIso }];
          }
        }
        return prev;
      });
    }

    setAnalyticsEvents(prev => {
      const updated = [clickEvent, ...prev];
      if (firstContactEvent) {
        return [firstContactEvent, ...updated];
      }
      return updated;
    });
  };
  
  
  // Brand Verification States & Handlers
  const [verificationRequests, setVerificationRequests] = useState<BrandVerificationRequest[]>(() => {
    const saved = localStorage.getItem('brizx_verification_requests');
    if (saved) return JSON.parse(saved);
    
    // Initial realistic mock requests
    return [
      {
        id: 'BRZX-AUD-2026-8102',
        seekerId: 's1',
        brandName: 'Urban Slice Pizza Lab',
        website: 'https://urbanslice.in',
        contactPhone: '+91 98888 77777',
        contactEmail: 'franchise@urbanslice.in',
        category: 'Food & Beverages',
        status: 'VERIFICATION_IN_PROGRESS',
        submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        notes: 'MCA registry search & trademark ownership verified. GST filings are currently under audit.',
        registrationNumber: 'U55101KA2021PTC145678',
        gstin: '29AABCU1234F1Z5',
        mcaCin: 'U55101KA2021PTC145678',
        trademarkNumber: 'TM-5432109',
        consentAccepted: true,
        assignedVerifierId: 'admin1',
        assignedVerifierName: 'BrizX Corporate Legal Team'
      },
      {
        id: 'BRZX-AUD-2026-9244',
        seekerId: 's1',
        brandName: 'CleanWash Automated Laundromats',
        website: 'https://cleanwash.in',
        contactPhone: '+91 97777 66666',
        contactEmail: 'partner@cleanwash.in',
        category: 'Retail & Services',
        status: 'DOCUMENTS_REQUIRED',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        notes: 'Please upload the standard franchise agreement draft and last 2 years audited financial records to proceed with the legal desk audit.',
        consentAccepted: true,
        assignedVerifierId: 'admin1',
        assignedVerifierName: 'BrizX Corporate Legal Team'
      }
    ];
  });

  const [verificationChecks, setVerificationChecks] = useState<VerificationCheck[]>(() => {
    const saved = localStorage.getItem('brizx_verification_checks');
    if (saved) return JSON.parse(saved);

    return [
      // Urban Slice Pizza Lab checks
      {
        checkId: 'chk-1-1',
        requestId: 'BRZX-AUD-2026-8102',
        checkType: 'MCA_REGISTRATION',
        checkName: 'Company / Business Registration',
        description: 'Verify incorporation records via MCA registry.',
        status: 'PASSED',
        reviewerId: 'admin1',
        notes: 'Active Private Limited registration confirmed under MCA India.',
        evidenceReferences: 'CIN U55101KA2021PTC145678, Active Status',
        reviewedAt: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        checkId: 'chk-1-2',
        requestId: 'BRZX-AUD-2026-8102',
        checkType: 'TRADEMARK_STATUS',
        checkName: 'Trademark Registration Status',
        description: 'Verify active brand/trademark ownership registry.',
        status: 'PASSED',
        reviewerId: 'admin1',
        notes: 'Trademark registered under Class 43 (F&B Services). Expiry in 2031.',
        evidenceReferences: 'Trademark Application #5432109 registered.',
        reviewedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        checkId: 'chk-1-3',
        requestId: 'BRZX-AUD-2026-8102',
        checkType: 'GST_FILINGS',
        checkName: 'GST Return Filing History',
        description: 'Analyze past 12 months GST return consistency.',
        status: 'PASSED',
        reviewerId: 'admin1',
        notes: 'GSTIN is active, GSTR-1 & GSTR-3B filed consistently over past 12 months.',
        evidenceReferences: 'GSTIN 29AABCU1234F1Z5, GSTR Filing Portal verified.',
        reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        checkId: 'chk-1-4',
        requestId: 'BRZX-AUD-2026-8102',
        checkType: 'FRANCHISE_AGREEMENT_FDD',
        checkName: 'FDD & Agreement Legal Review',
        description: 'Analyze franchise agreement clauses & lock-in terms.',
        status: 'PENDING',
        notes: 'Pending analysis of territorial lock-in periods and renewal fee structure.'
      },
      {
        checkId: 'chk-1-5',
        requestId: 'BRZX-AUD-2026-8102',
        checkType: 'UNIT_ECONOMICS_AUDIT',
        checkName: 'Unit Economics & Profit Auditing',
        description: 'Cross-verify advertised capex vs. actual setup invoices.',
        status: 'PENDING',
        notes: 'Currently cross-matching sample outlet EBITDA sheets with merchant accounts.'
      },
      {
        checkId: 'chk-1-6',
        requestId: 'BRZX-AUD-2026-8102',
        checkType: 'LITIGATION_SEARCH',
        checkName: 'Civil & Tax Litigation Check',
        description: 'Query judicial records for pending litigation.',
        status: 'PASSED',
        reviewerId: 'admin1',
        notes: 'No major adverse litigations or regulatory actions found in e-Courts search.',
        evidenceReferences: 'e-Courts National Database Search',
        reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },

      // CleanWash Automated Laundromats checks
      {
        checkId: 'chk-2-1',
        requestId: 'BRZX-AUD-2026-9244',
        checkType: 'MCA_REGISTRATION',
        checkName: 'Company / Business Registration',
        description: 'Verify incorporation records via MCA registry.',
        status: 'PENDING',
        notes: 'Awaiting submission of Incorporation Certificate.'
      },
      {
        checkId: 'chk-2-2',
        requestId: 'BRZX-AUD-2026-9244',
        checkType: 'TRADEMARK_STATUS',
        checkName: 'Trademark Registration Status',
        description: 'Verify active brand/trademark ownership registry.',
        status: 'PENDING',
        notes: 'Searching brand wordmark registries.'
      },
      {
        checkId: 'chk-2-3',
        requestId: 'BRZX-AUD-2026-9244',
        checkType: 'GST_FILINGS',
        checkName: 'GST Return Filing History',
        description: 'Analyze past 12 months GST return consistency.',
        status: 'PENDING',
        notes: 'Awaiting GST registration documents.'
      },
      {
        checkId: 'chk-2-4',
        requestId: 'BRZX-AUD-2026-9244',
        checkType: 'FRANCHISE_AGREEMENT_FDD',
        checkName: 'FDD & Agreement Legal Review',
        description: 'Analyze franchise agreement clauses & lock-in terms.',
        status: 'PENDING',
        notes: 'FDD documents required.'
      },
      {
        checkId: 'chk-2-5',
        requestId: 'BRZX-AUD-2026-9244',
        checkType: 'UNIT_ECONOMICS_AUDIT',
        checkName: 'Unit Economics & Profit Auditing',
        description: 'Cross-verify advertised capex vs. actual setup invoices.',
        status: 'PENDING',
        notes: 'Financial model details requested.'
      },
      {
        checkId: 'chk-2-6',
        requestId: 'BRZX-AUD-2026-9244',
        checkType: 'LITIGATION_SEARCH',
        checkName: 'Civil & Tax Litigation Check',
        description: 'Query judicial records for pending litigation.',
        status: 'PENDING',
        notes: 'Pending background check.'
      }
    ];
  });

  const [verificationDocuments, setVerificationDocuments] = useState<VerificationDocument[]>(() => {
    const saved = localStorage.getItem('brizx_verification_documents');
    if (saved) return JSON.parse(saved);

    return [
      {
        documentId: 'doc-1-1',
        requestId: 'BRZX-AUD-2026-8102',
        uploadedBy: 's1',
        documentType: 'GST_CERTIFICATE',
        documentTypeName: 'GST Registration Certificate',
        fileName: 'GSTIN_Registration_29AABC.pdf',
        fileSize: '1.2 MB',
        fileType: 'application/pdf',
        storagePath: 'dummy_link_gst',
        status: 'ACCEPTED',
        reviewerNote: 'Verified with GST portal records. Active and compliant.',
        uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        reviewedAt: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        documentId: 'doc-1-2',
        requestId: 'BRZX-AUD-2026-8102',
        uploadedBy: 's1',
        documentType: 'INCORPORATION_CERTIFICATE',
        documentTypeName: 'Certificate of Incorporation',
        fileName: 'COI_UrbanSlicePizza.pdf',
        fileSize: '2.1 MB',
        fileType: 'application/pdf',
        storagePath: 'dummy_link_coi',
        status: 'ACCEPTED',
        reviewerNote: 'Matches MCA filing record.',
        uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        reviewedAt: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ];
  });

  const [verificationAuditLogs, setVerificationAuditLogs] = useState<VerificationAuditLog[]>(() => {
    const saved = localStorage.getItem('brizx_verification_audit_logs');
    if (saved) return JSON.parse(saved);

    return [
      {
        logId: 'log-1-1',
        requestId: 'BRZX-AUD-2026-8102',
        actorId: 's1',
        actorName: 'Priya K. Sharma',
        actorRole: 'FRANCHISE_SEEKER',
        action: 'SUBMITTED',
        newStatus: 'SUBMITTED',
        note: 'Initial brand audit inquiry submitted for Urban Slice Pizza Lab.',
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        logId: 'log-1-2',
        requestId: 'BRZX-AUD-2026-8102',
        actorId: 'admin1',
        actorName: 'BrizX Corporate Legal Team',
        actorRole: 'SUPER_ADMIN',
        action: 'STATUS_CHANGE',
        previousStatus: 'SUBMITTED',
        newStatus: 'VERIFICATION_IN_PROGRESS',
        note: 'Audit assigned to verifier and registry lookup initiated.',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        logId: 'log-1-3',
        requestId: 'BRZX-AUD-2026-8102',
        actorId: 'admin1',
        actorName: 'BrizX Corporate Legal Team',
        actorRole: 'SUPER_ADMIN',
        action: 'CHECK_PASSED',
        note: 'MCA Incorporation and Trademark Registration checks completed successfully.',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ];
  });

  const [legalAdvisorQuestions, setLegalAdvisorQuestions] = useState<LegalAdvisorQuestion[]>(() => {
    const saved = localStorage.getItem('brizx_legal_queries');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'q-1',
        seekerId: 's1',
        seekerName: 'Priya K. Sharma',
        question: 'Is the standard royalty fee of 5% calculated on Gross or Net turnover in India?',
        answer: 'Generally, franchisors charge on Gross Turnover (excluding taxes). Charging on Net or profits is rare as it requires auditing your operational costs. Ensure you inspect the tax definitions closely.',
        status: 'ANSWERED',
        category: 'Royalty & Finance',
        submittedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        answeredAt: new Date(Date.now() - 86400000 * 9).toISOString(),
        advisorName: 'Advocate Ramesh Sen (BrizX Legal Desk)'
      }
    ];
  });

  // Sync brand verification states to localStorage
  useEffect(() => {
    localStorage.setItem('brizx_verification_requests', JSON.stringify(verificationRequests));
  }, [verificationRequests]);

  useEffect(() => {
    localStorage.setItem('brizx_verification_checks', JSON.stringify(verificationChecks));
  }, [verificationChecks]);

  useEffect(() => {
    localStorage.setItem('brizx_verification_documents', JSON.stringify(verificationDocuments));
  }, [verificationDocuments]);

  useEffect(() => {
    localStorage.setItem('brizx_verification_audit_logs', JSON.stringify(verificationAuditLogs));
  }, [verificationAuditLogs]);

  useEffect(() => {
    localStorage.setItem('brizx_legal_queries', JSON.stringify(legalAdvisorQuestions));
  }, [legalAdvisorQuestions]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  
  const [leadStages, setLeadStages] = useState<CRMLeadRecord[]>([
    { seekerId: 's1', brandId: 'b1', stage: 'MEETING_SCHEDULED', updatedAt: new Date().toISOString() },
    { seekerId: 's2', brandId: 'b1', stage: 'NEW', updatedAt: new Date().toISOString() },
    { seekerId: 's3', brandId: 'b1', stage: 'CONTACTED', updatedAt: new Date().toISOString() }
  ]);

  const [crmTasks, setCrmTasks] = useState<CRMTask[]>([
    {
      id: 't1',
      brandId: 'b1',
      seekerId: 's1',
      title: 'Send Unit Economics PDF & Franchise Agreement Draft',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      completed: false,
      priority: 'HIGH',
      createdAt: new Date().toISOString()
    },
    {
      id: 't2',
      brandId: 'b1',
      seekerId: 's2',
      title: 'Follow-up call on Capex & Outer Ring Road Site Selection',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      completed: false,
      priority: 'MEDIUM',
      createdAt: new Date().toISOString()
    }
  ]);

  const [invoices, setInvoices] = useState<PaymentInvoice[]>(() => {
    const saved = localStorage.getItem('brizx_invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'INV-2026-8801',
        brandId: 'b1',
        brandName: 'Burger Kingsway',
        invoiceNumber: 'INV-2026-8801',
        planName: 'BrizX Professional Plan (25 Unlocks/mo)',
        itemType: 'SUBSCRIPTION',
        creditsAdded: 25,
        amount: 19999,
        gstType: 'INTRA_STATE',
        cgstRate: 9,
        cgstAmount: 1799.91,
        sgstRate: 9,
        sgstAmount: 1799.91,
        igstRate: 0,
        igstAmount: 0,
        gstAmount: 3599.82,
        totalAmount: 23598.82,
        paymentMode: 'UPI',
        paymentId: 'pay_rzp_live98411',
        status: 'SUCCESS',
        date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0],
        sacCode: '998314'
      },
      {
        id: 'INV-2025-4102',
        brandId: 'b1',
        brandName: 'Burger Kingsway',
        invoiceNumber: 'INV-2025-4102',
        planName: 'BrizX Starter Plan Activation',
        itemType: 'SUBSCRIPTION',
        creditsAdded: 10,
        amount: 9999,
        gstType: 'INTRA_STATE',
        cgstRate: 9,
        cgstAmount: 899.91,
        sgstRate: 9,
        sgstAmount: 899.91,
        igstRate: 0,
        igstAmount: 0,
        gstAmount: 1799.82,
        totalAmount: 11798.82,
        paymentMode: 'CREDIT_CARD',
        paymentId: 'pay_rzp_live31088',
        status: 'SUCCESS',
        date: new Date(Date.now() - 86400000 * 45).toISOString().split('T')[0],
        sacCode: '998314'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('brizx_invoices', JSON.stringify(invoices));
    } catch (e) {
      console.warn('Failed to save invoices to localStorage', e);
    }
  }, [invoices]);

  const [crmNotes, setCrmNotes] = useState<CRMNote[]>([
    {
      id: 'n1',
      brandId: 'b1',
      seekerId: 's1',
      text: 'Good background in tech, interested in multiple locations across Outer Ring Road.',
      createdAt: new Date().toISOString()
    }
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 'm1',
      brandId: 'b1',
      seekerId: 's1',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '03:00 PM',
      status: 'CONFIRMED',
      brandName: 'Burger Kingsway',
      location: 'Google Meet (Online Video Call)',
      notes: 'Initial 1-on-1 Franchise Investment Strategy & Unit Economics Review',
      meetingLink: 'https://meet.google.com/brzx-m1-demo'
    },
    {
      id: 'm2',
      brandId: 'b2',
      seekerId: 's1',
      date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      time: '11:30 AM',
      status: 'PENDING',
      brandName: 'Chai Point Express',
      location: 'BrizX Bangalore Hub / Online',
      notes: 'Territory Exclusivity Discussion for Outer Ring Road'
    }
  ]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub1',
      brandId: 'b1',
      plan: 'PROFESSIONAL',
      status: 'ACTIVE',
      startDate: new Date(Date.now() - 86400000 * 15).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 15).toISOString(),
      unlocksRemaining: 24
    }
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('brizx_subscriptions', JSON.stringify(subscriptions));
    } catch (e) {
      console.warn('Failed to save subscriptions to localStorage', e);
    }
  }, [subscriptions]);

  const updateSeeker = async (id: string, data: Partial<FranchiseSeeker>) => {
    setSeekers(prev => {
      const exists = prev.some(s => s.id === id || (data.email && s.email === data.email));
      let updated: FranchiseSeeker[];
      if (exists) {
        updated = prev.map(s => (s.id === id || (data.email && s.email === data.email)) ? { ...s, ...data } : s);
      } else {
        updated = [...prev, { id, role: 'FRANCHISE_SEEKER', ...data } as FranchiseSeeker];
      }
      try {
        localStorage.setItem('brizx_seekers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (id && id !== 'seeker1' && id !== 'seeker_anon') {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        await setDoc(doc(db, 'seekers', id), data, { merge: true });
        await setDoc(doc(db, 'users', id), data, { merge: true });
      } catch (e) {
        console.warn('Firestore sync warning in updateSeeker:', e);
      }
    }
  };

  const updateBrand = async (id: string, data: Partial<Brand>) => {
    if (!id) {
      console.error('updateBrand error: Cannot update brand without ID');
      throw new Error('Brand ID is required for update operation.');
    }

    setBrands(prev => {
      const exists = prev.some(b => b.id === id || (data.email && b.email?.toLowerCase() === data.email.toLowerCase()));
      let updated: Brand[];
      if (exists) {
        updated = prev.map(b => (b.id === id || (data.email && b.email?.toLowerCase() === data.email.toLowerCase())) ? { ...b, ...data } : b);
      } else {
        updated = [...prev, { id, role: 'BRAND_OWNER', ...data } as Brand];
      }
      try {
        localStorage.setItem('brizx_brands', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save brands to localStorage', e);
      }
      return updated;
    });

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await setDoc(doc(db, 'brands', id), data, { merge: true });
      
      const targetBrand = brands.find(b => b.id === id);
      const emailToSync = data.email || targetBrand?.email;
      const syncData = {
        ...data,
        ...(emailToSync ? { email: emailToSync } : {}),
        role: 'BRAND_OWNER'
      };
      await setDoc(doc(db, 'users', id), syncData, { merge: true });
    } catch (e) {
      console.warn('Firestore sync warning in updateBrand:', e);
      throw e;
    }
  };

  const addCRMNote = (note: Omit<CRMNote, 'id' | 'createdAt'>) => {
    setCrmNotes(prev => [...prev, { ...note, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }]);
  };

  const unlockLead = (brandId: string, seekerId: string) => {
    const seeker = seekers.find(s => s.id === seekerId);
    const brand = brands.find(b => b.id === brandId);
    const score = brand && seeker ? calculateBrandSeekerMatch(brand, seeker).totalScore : (seeker?.matchScore || 90);
    const nowIso = new Date().toISOString();

    setBrands(prev => prev.map(b => {
      if (b.id === brandId) {
        const isAlreadyUnlocked = (b.unlockedLeads || []).includes(seekerId);
        const unlocked = isAlreadyUnlocked ? b.unlockedLeads : [...(b.unlockedLeads || []), seekerId];
        return { ...b, unlockedLeads: unlocked };
      }
      return b;
    }));
    setSubscriptions(prev => prev.map(s => {
      if (s.brandId === brandId && s.unlocksRemaining > 0) {
        return { ...s, unlocksRemaining: s.unlocksRemaining - 1 };
      }
      return s;
    }));

    // Auto-record CRM record if not present
    setLeadStages(prev => {
      const existing = prev.find(l => l.brandId === brandId && l.seekerId === seekerId);
      if (!existing) {
        return [...prev, { brandId, seekerId, stage: 'NEW', updatedAt: nowIso }];
      }
      return prev;
    });

    // Log CONTACT_UNLOCKED event
    logAnalyticsEvent({
      brandId,
      seekerId,
      eventType: 'CONTACT_UNLOCKED',
      timestamp: nowIso,
      matchScore: score,
      city: seeker?.city,
      industry: seeker?.industry,
      investment: seeker?.investment
    });
  };

  const toggleSaveLeadForBrand = (brandId: string, seekerId: string) => {
    setBrands(prev => prev.map(b => {
      if (b.id === brandId) {
        const isSaved = (b.savedLeads || []).includes(seekerId);
        const updated = isSaved ? (b.savedLeads || []).filter(id => id !== seekerId) : [...(b.savedLeads || []), seekerId];
        return { ...b, savedLeads: updated };
      }
      return b;
    }));
  };

  const updateLeadStage = (brandId: string, seekerId: string, stage: LeadStage) => {
    const nowIso = new Date().toISOString();
    setLeadStages(prev => {
      const existing = prev.find(l => l.brandId === brandId && l.seekerId === seekerId);
      if (existing) {
        return prev.map(l => l.brandId === brandId && l.seekerId === seekerId ? { ...l, stage, updatedAt: nowIso } : l);
      }
      return [...prev, { brandId, seekerId, stage, updatedAt: nowIso }];
    });

    if (stage === 'NEGOTIATING' || stage === 'LOI_SIGNED') {
      logAnalyticsEvent({
        brandId,
        seekerId,
        eventType: 'FRANCHISE_DISCUSSION',
        timestamp: nowIso,
        metadata: { stage }
      });
    } else if (stage === 'CONVERTED') {
      logAnalyticsEvent({
        brandId,
        seekerId,
        eventType: 'DEAL_CLOSED',
        timestamp: nowIso,
        metadata: { stage }
      });
    }
  };

  const addCRMTask = (task: Omit<CRMTask, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: CRMTask = {
      ...task,
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setCrmTasks(prev => [newTask, ...prev]);
  };

  const toggleCRMTask = (taskId: string) => {
    setCrmTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const scheduleMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting: Meeting = {
      ...meeting,
      id: 'm_' + Math.random().toString(36).substr(2, 9)
    };
    setMeetings(prev => [newMeeting, ...prev]);

    const seeker = seekers.find(s => s.id === meeting.seekerId);
    const brand = brands.find(b => b.id === meeting.brandId);
    const score = brand && seeker ? calculateBrandSeekerMatch(brand, seeker).totalScore : (seeker?.matchScore || 90);
    const nowIso = new Date().toISOString();

    // Log MEETING_SCHEDULED event
    logAnalyticsEvent({
      brandId: meeting.brandId,
      seekerId: meeting.seekerId,
      eventType: 'MEETING_SCHEDULED',
      timestamp: nowIso,
      matchScore: score,
      city: seeker?.city,
      industry: seeker?.industry,
      investment: seeker?.investment,
      metadata: { date: meeting.date, time: meeting.time }
    });

    // Update CRM stage to MEETING_SCHEDULED if not already in further stage
    setLeadStages(prev => {
      const existing = prev.find(l => l.brandId === meeting.brandId && l.seekerId === meeting.seekerId);
      if (existing && (existing.stage === 'NEW' || existing.stage === 'CONTACTED')) {
        return prev.map(l => l.brandId === meeting.brandId && l.seekerId === meeting.seekerId ? { ...l, stage: 'MEETING_SCHEDULED', updatedAt: nowIso } : l);
      }
      return prev;
    });

    // Send a notification to seeker
    setNotifications(prev => [
      {
        id: 'notif_' + Math.random().toString(36).substr(2, 9),
        userId: meeting.seekerId,
        title: `Meeting Requested with ${meeting.brandName || 'Brand'}`,
        message: `Your meeting request for ${meeting.date} at ${meeting.time || '10:00 AM'} has been submitted.`,
        type: 'MEETING',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const cancelMeeting = (meetingId: string) => {
    setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, status: 'CANCELLED' } : m));
  };

  const updateMeetingStatus = (meetingId: string, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    setMeetings(prev => prev.map(m => (m.id === meetingId || (m as any).meetingId === meetingId) ? { ...m, status } : m));

    if (status === 'COMPLETED') {
      const meeting = meetings.find(m => m.id === meetingId || (m as any).meetingId === meetingId);
      if (meeting) {
        logAnalyticsEvent({
          brandId: meeting.brandId,
          seekerId: meeting.seekerId,
          eventType: 'MEETING_COMPLETED',
          timestamp: new Date().toISOString(),
          metadata: { meetingId }
        });
      }
    }
  };

  const verifySeeker = (id: string) => {
    setSeekers(prev => prev.map(s => s.id === id ? { ...s, verified: true } : s));
  };

  const toggleSaveBrand = (seekerId: string, brandId: string) => {
    setSeekers(prev => prev.map(s => {
      if (s.id === seekerId) {
        const currentSaved = s.savedBrandIds || [];
        const isAlreadySaved = currentSaved.includes(brandId);
        const updatedSaved = isAlreadySaved
          ? currentSaved.filter(id => id !== brandId)
          : [...currentSaved, brandId];
        return { ...s, savedBrandIds: updatedSaved };
      }
      return s;
    }));
  };

  const addVerificationRequest = (req: Omit<BrandVerificationRequest, 'id' | 'submittedAt' | 'updatedAt' | 'status' | 'consentAccepted'>) => {
    const year = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const requestId = `BRZX-AUD-${year}-${randNum}`;
    
    const newReq: BrandVerificationRequest = {
      ...req,
      id: requestId,
      status: 'SUBMITTED',
      consentAccepted: true,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: 'Initial validation request submitted. BrizX Legal desk is reviewing details and starting registries search.'
    };

    // Auto-create default checklist items for this request
    const defaultChecks: VerificationCheck[] = [
      {
        checkId: `chk-${requestId}-1`,
        requestId: requestId,
        checkType: 'MCA_REGISTRATION',
        checkName: 'Company / Business Registration',
        description: 'Verify incorporation records via MCA registry.',
        status: 'PENDING',
        notes: 'Pending registry verification'
      },
      {
        checkId: `chk-${requestId}-2`,
        requestId: requestId,
        checkType: 'TRADEMARK_STATUS',
        checkName: 'Trademark Registration Status',
        description: 'Verify active brand/trademark ownership registry.',
        status: 'PENDING',
        notes: 'Pending wordmark database verification'
      },
      {
        checkId: `chk-${requestId}-3`,
        requestId: requestId,
        checkType: 'GST_FILINGS',
        checkName: 'GST Return Filing History',
        description: 'Analyze past 12 months GST return consistency.',
        status: 'PENDING',
        notes: 'Pending registration check'
      },
      {
        checkId: `chk-${requestId}-4`,
        requestId: requestId,
        checkType: 'FRANCHISE_AGREEMENT_FDD',
        checkName: 'FDD & Agreement Legal Review',
        description: 'Analyze franchise agreement clauses & lock-in terms.',
        status: 'PENDING',
        notes: 'Pending document retrieval'
      },
      {
        checkId: `chk-${requestId}-5`,
        requestId: requestId,
        checkType: 'UNIT_ECONOMICS_AUDIT',
        checkName: 'Unit Economics & Profit Auditing',
        description: 'Cross-verify advertised capex vs. actual setup invoices.',
        status: 'PENDING',
        notes: 'Pending model audit'
      },
      {
        checkId: `chk-${requestId}-6`,
        requestId: requestId,
        checkType: 'LITIGATION_SEARCH',
        checkName: 'Civil & Tax Litigation Check',
        description: 'Query judicial records for pending litigation.',
        status: 'PENDING',
        notes: 'Pending judicial records search'
      }
    ];

    const initialAuditLog: VerificationAuditLog = {
      logId: 'log_' + Math.random().toString(36).substr(2, 9),
      requestId: requestId,
      actorId: req.seekerId,
      actorName: seekers.find(s => s.id === req.seekerId)?.name || 'Franchise Seeker',
      actorRole: 'FRANCHISE_SEEKER',
      action: 'SUBMITTED',
      newStatus: 'SUBMITTED',
      note: 'Audit requested successfully for ' + req.brandName,
      timestamp: new Date().toISOString()
    };

    setVerificationRequests(prev => [newReq, ...prev]);
    setVerificationChecks(prev => [...defaultChecks, ...prev]);
    setVerificationAuditLogs(prev => [initialAuditLog, ...prev]);

    // Send notification to seeker
    setNotifications(prev => [
      {
        id: 'notif_' + Math.random().toString(36).substr(2, 9),
        userId: req.seekerId,
        title: `Brand Due Diligence Initiated: ${req.brandName}`,
        message: `Your independent audit request (ID: ${requestId}) is registered successfully. Complete your profile to proceed.`,
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif_admin_' + Math.random().toString(36).substr(2, 9),
        userId: 'admin1',
        title: `New Brand Audit Request`,
        message: `Seeker requested independent registry lookup for "${req.brandName}". Status: SUBMITTED.`,
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const updateVerificationRequest = (
    id: string, 
    data: Partial<BrandVerificationRequest>, 
    actorId: string, 
    actorName: string, 
    actorRole: string
  ) => {
    let oldStatus: BrandVerificationStatus | undefined;
    
    setVerificationRequests(prev => prev.map(r => {
      if (r.id === id) {
        oldStatus = r.status;
        return {
          ...r,
          ...data,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    // Generate audit log if status or assigned verifier or note is changed
    if (data.status && oldStatus && oldStatus !== data.status) {
      const log: VerificationAuditLog = {
        logId: 'log_' + Math.random().toString(36).substr(2, 9),
        requestId: id,
        actorId,
        actorName,
        actorRole,
        action: 'STATUS_CHANGE',
        previousStatus: oldStatus,
        newStatus: data.status,
        note: data.notes || `Verification status advanced from ${oldStatus} to ${data.status}.`,
        timestamp: new Date().toISOString()
      };
      setVerificationAuditLogs(prev => [log, ...prev]);

      // Notify the seeker
      const request = verificationRequests.find(r => r.id === id);
      if (request) {
        setNotifications(prev => [
          {
            id: 'notif_' + Math.random().toString(36).substr(2, 9),
            userId: request.seekerId,
            title: `Audit Status Update: ${request.brandName}`,
            message: `Your brand audit status changed to ${data.status.replace(/_/g, ' ')}. Update Note: ${data.notes || 'In progress'}`,
            type: 'SYSTEM',
            read: false,
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
      }
    } else if (data.notes) {
      const log: VerificationAuditLog = {
        logId: 'log_' + Math.random().toString(36).substr(2, 9),
        requestId: id,
        actorId,
        actorName,
        actorRole,
        action: 'NOTE_ADDED',
        note: `Advisor Update added: "${data.notes}"`,
        timestamp: new Date().toISOString()
      };
      setVerificationAuditLogs(prev => [log, ...prev]);
    }
  };

  const uploadVerificationDocument = (
    requestId: string,
    docType: VerificationDocument['documentType'],
    docTypeName: string,
    fileName: string,
    fileSize: string,
    fileData: string, // Base64 simulated secure link or file reference
    uploadedBy: string
  ) => {
    const docId = 'doc_' + Math.random().toString(36).substr(2, 9);
    const newDoc: VerificationDocument = {
      documentId: docId,
      requestId,
      uploadedBy,
      documentType: docType,
      documentTypeName: docTypeName,
      fileName,
      fileSize,
      fileType: 'application/pdf',
      storagePath: fileData || 'dummy_file_path',
      status: 'UPLOADED',
      uploadedAt: new Date().toISOString()
    };

    setVerificationDocuments(prev => [newDoc, ...prev]);

    // Add Audit Log
    const req = verificationRequests.find(r => r.id === requestId);
    const log: VerificationAuditLog = {
      logId: 'log_' + Math.random().toString(36).substr(2, 9),
      requestId,
      actorId: uploadedBy,
      actorName: seekers.find(s => s.id === uploadedBy)?.name || 'Franchise Seeker',
      actorRole: 'FRANCHISE_SEEKER',
      action: 'DOCUMENT_UPLOADED',
      note: `Document "${fileName}" (${docTypeName}) was uploaded successfully.`,
      timestamp: new Date().toISOString()
    };
    setVerificationAuditLogs(prev => [log, ...prev]);

    // Send notification to Verifier
    setNotifications(prev => [
      {
        id: 'notif_admin_' + Math.random().toString(36).substr(2, 9),
        userId: 'admin1',
        title: `Document Uploaded: ${req?.brandName || 'Inquiry'}`,
        message: `Seeker uploaded compliance document "${fileName}" (${docTypeName}) for review.`,
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const reviewVerificationDocument = (
    docId: string,
    status: 'ACCEPTED' | 'REJECTED',
    reviewerNote: string,
    reviewerId: string,
    reviewerName: string
  ) => {
    let reqId = '';
    let docName = '';
    
    setVerificationDocuments(prev => prev.map(d => {
      if (d.documentId === docId) {
        reqId = d.requestId;
        docName = d.fileName;
        return {
          ...d,
          status,
          reviewerNote,
          reviewedAt: new Date().toISOString()
        };
      }
      return d;
    }));

    if (reqId) {
      // Add Audit Log
      const log: VerificationAuditLog = {
        logId: 'log_' + Math.random().toString(36).substr(2, 9),
        requestId: reqId,
        actorId: reviewerId,
        actorName: reviewerName,
        actorRole: 'SUPER_ADMIN',
        action: status === 'ACCEPTED' ? 'DOCUMENT_ACCEPTED' : 'DOCUMENT_REJECTED',
        note: `Document "${docName}" was reviewed and ${status}. Verifier note: "${reviewerNote}"`,
        timestamp: new Date().toISOString()
      };
      setVerificationAuditLogs(prev => [log, ...prev]);

      // Notify the Seeker
      const req = verificationRequests.find(r => r.id === reqId);
      if (req) {
        setNotifications(prev => [
          {
            id: 'notif_' + Math.random().toString(36).substr(2, 9),
            userId: req.seekerId,
            title: `Document Review: ${req.brandName}`,
            message: `Your document "${docName}" was ${status}. Reviewer comment: "${reviewerNote}"`,
            type: 'SYSTEM',
            read: false,
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
      }
    }
  };

  const updateVerificationCheck = (
    checkId: string,
    status: VerificationCheck['status'],
    notes: string,
    evidence: string,
    reviewerId: string,
    reviewerName: string
  ) => {
    let reqId = '';
    let checkName = '';
    
    setVerificationChecks(prev => prev.map(c => {
      if (c.checkId === checkId) {
        reqId = c.requestId;
        checkName = c.checkName;
        return {
          ...c,
          status,
          notes,
          evidenceReferences: evidence,
          reviewerId,
          reviewedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    if (reqId) {
      const log: VerificationAuditLog = {
        logId: 'log_' + Math.random().toString(36).substr(2, 9),
        requestId: reqId,
        actorId: reviewerId,
        actorName: reviewerName,
        actorRole: 'SUPER_ADMIN',
        action: 'CHECK_UPDATED',
        note: `Compliance Check "${checkName}" was updated to ${status}. Details: "${notes}"`,
        timestamp: new Date().toISOString()
      };
      setVerificationAuditLogs(prev => [log, ...prev]);
    }
  };

  const askLegalAdvisor = (seekerId: string, question: string, seekerName: string) => {
    const qId = 'q_' + Math.random().toString(36).substr(2, 9);
    const newQ: LegalAdvisorQuestion = {
      id: qId,
      seekerId,
      seekerName,
      question,
      status: 'OPEN',
      submittedAt: new Date().toISOString()
    };

    setLegalAdvisorQuestions(prev => [newQ, ...prev]);

    // Admin notify
    setNotifications(prev => [
      {
        id: 'notif_admin_' + Math.random().toString(36).substr(2, 9),
        userId: 'admin1',
        title: `New Legal Counsel Inquiry`,
        message: `Seeker ${seekerName} submitted a legal agreement question: "${question.substring(0, 50)}..."`,
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const answerLegalAdvisor = (questionId: string, answer: string, advisorName: string) => {
    let seekerId = '';
    let questionText = '';
    
    setLegalAdvisorQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        seekerId = q.seekerId;
        questionText = q.question;
        return {
          ...q,
          answer,
          advisorName,
          status: 'ANSWERED',
          answeredAt: new Date().toISOString()
        };
      }
      return q;
    }));

    if (seekerId) {
      // Seeker notify
      setNotifications(prev => [
        {
          id: 'notif_' + Math.random().toString(36).substr(2, 9),
          userId: seekerId,
          title: `Legal Counsel Response`,
          message: `Your query regarding "${questionText.substring(0, 30)}..." has been answered by ${advisorName}.`,
          type: 'SYSTEM',
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = (userId: string) => {
    setNotifications(prev => prev.filter(n => n.userId !== userId));
  };

  const upgradeSeekerToPremium = (seekerId: string) => {
    setSeekers(prev => prev.map(s => s.id === seekerId ? { ...s, isPremium: true } : s));
  };

  const renewSubscription = (
    brandId: string, 
    plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE', 
    unlocks: number, 
    price: number,
    mode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING'
  ) => {
    setSubscriptions(prev => {
      const existing = prev.find(s => s.brandId === brandId);
      if (existing) {
        return prev.map(s => s.brandId === brandId ? {
          ...s,
          plan,
          status: 'ACTIVE',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
          unlocksRemaining: s.unlocksRemaining + unlocks
        } : s);
      }
      return [...prev, {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        brandId,
        plan,
        status: 'ACTIVE',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
        unlocksRemaining: unlocks
      }];
    });

    // Update brand tier
    setBrands(prev => prev.map(b => b.id === brandId ? { ...b, subscriptionTier: plan } : b));

    // Create Invoice
    const gst = price * 0.18;
    const inv: PaymentInvoice = {
      id: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      brandId,
      planName: `BrizX ${plan} Subscription Plan (${unlocks} Unlocks)`,
      amount: price,
      gstAmount: Number(gst.toFixed(2)),
      totalAmount: Number((price + gst).toFixed(2)),
      paymentMode: mode,
      status: 'SUCCESS',
      date: new Date().toISOString().split('T')[0]
    };

    setInvoices(prev => [inv, ...prev]);

    // Send notification
    setNotifications(prev => [
      {
        id: 'notif_' + Math.random().toString(36).substr(2, 9),
        userId: brandId,
        title: `Subscription Activated: ${plan} Plan`,
        message: `Your payment of ₹${inv.totalAmount.toLocaleString()} was successful. ${unlocks} lead unlocks added to your account.`,
        type: 'PAYMENT',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const updateBrandBillingDetails = (brandId: string, billing: BrandBillingDetails) => {
    setBrands(prev => prev.map(b => b.id === brandId ? { ...b, billingDetails: billing } : b));
  };

  const buyCreditPackPayment = async (
    brandId: string, 
    packId: string, 
    mode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD',
    paymentRef?: string
  ): Promise<PaymentInvoice> => {
    const brand = brands.find(b => b.id === brandId) || { id: brandId, brandName: 'Brand', email: '' } as any;
    const pack = CREDIT_PACKS.find(p => p.id === packId) || CREDIT_PACKS[0];

    // Server-side order creation
    const orderRes = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-id': brandId,
        'x-user-id': brandId
      },
      body: JSON.stringify({
        itemType: 'CREDIT_PACK',
        itemId: pack.id,
        paymentMode: mode,
        billingDetails: brand.billingDetails
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.order) {
      throw new Error(orderData.error || 'Failed to create payment order');
    }

    const { order } = orderData;
    const paymentId = paymentRef || `pay_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Server-side verification
    const verifyRes = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-id': brandId,
        'x-user-id': brandId
      },
      body: JSON.stringify({
        orderId: order.orderId,
        paymentId,
        paymentSignature: `sig_${paymentId}_verified`
      })
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.success || !verifyData.invoice) {
      throw new Error(verifyData.error || 'Payment verification failed on server');
    }

    const invoice: PaymentInvoice = verifyData.invoice;

    // Update invoices
    setInvoices(prev => {
      const filtered = prev.filter(i => i.id !== invoice.id);
      return [invoice, ...filtered];
    });

    // Update subscriptions / unlocks
    setSubscriptions(prev => {
      const existing = prev.find(s => s.brandId === brandId);
      if (existing) {
        return prev.map(s => s.brandId === brandId ? {
          ...s,
          unlocksRemaining: s.unlocksRemaining + pack.credits
        } : s);
      }
      return [...prev, {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        brandId,
        plan: (brand.subscriptionTier as any) || 'STARTER',
        status: 'ACTIVE',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
        unlocksRemaining: pack.credits
      }];
    });

    // Send in-app notification
    setNotifications(prev => [
      {
        id: 'notif_' + Math.random().toString(36).substr(2, 9),
        userId: brandId,
        title: `Payment Verified: +${pack.credits} Credits Added`,
        message: `Your payment of ₹${invoice.totalAmount.toLocaleString()} (${invoice.paymentMode}) was verified. ${pack.credits} contact unlock credits are now available. Tax invoice ${invoice.id} generated.`,
        type: 'PAYMENT',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    return invoice;
  };

  const processSubscriptionPayment = async (
    brandId: string,
    planName: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE',
    mode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD',
    paymentRef?: string
  ): Promise<PaymentInvoice> => {
    const brand = brands.find(b => b.id === brandId) || { id: brandId, brandName: 'Brand', email: '' } as any;
    const planConfig = SUBSCRIPTION_PLANS[planName];

    // Server-side order creation
    const orderRes = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-id': brandId,
        'x-user-id': brandId
      },
      body: JSON.stringify({
        itemType: 'SUBSCRIPTION',
        itemId: planName,
        paymentMode: mode,
        billingDetails: brand.billingDetails
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.order) {
      throw new Error(orderData.error || 'Failed to create subscription order');
    }

    const { order } = orderData;
    const paymentId = paymentRef || `pay_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Server-side verification
    const verifyRes = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-id': brandId,
        'x-user-id': brandId
      },
      body: JSON.stringify({
        orderId: order.orderId,
        paymentId,
        paymentSignature: `sig_${paymentId}_verified`
      })
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.success || !verifyData.invoice) {
      throw new Error(verifyData.error || 'Payment verification failed on server');
    }

    const invoice: PaymentInvoice = verifyData.invoice;

    // Update invoices
    setInvoices(prev => {
      const filtered = prev.filter(i => i.id !== invoice.id);
      return [invoice, ...filtered];
    });

    // Update subscriptions / unlocks
    setSubscriptions(prev => {
      const existing = prev.find(s => s.brandId === brandId);
      if (existing) {
        return prev.map(s => s.brandId === brandId ? {
          ...s,
          plan: planName,
          status: 'ACTIVE',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
          unlocksRemaining: s.unlocksRemaining + planConfig.unlocksPerMonth
        } : s);
      }
      return [...prev, {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        brandId,
        plan: planName,
        status: 'ACTIVE',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
        unlocksRemaining: planConfig.unlocksPerMonth
      }];
    });

    // Update brand tier
    setBrands(prev => prev.map(b => b.id === brandId ? { ...b, subscriptionTier: planName } : b));

    // Send in-app notification
    setNotifications(prev => [
      {
        id: 'notif_' + Math.random().toString(36).substr(2, 9),
        userId: brandId,
        title: `Plan Activated: ${planConfig.name}`,
        message: `Your payment of ₹${invoice.totalAmount.toLocaleString()} has been verified. Subscription upgraded to ${planName} with ${planConfig.unlocksPerMonth} lead unlocks. Tax Invoice ${invoice.id} is ready.`,
        type: 'PAYMENT',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    return invoice;
  };

  const requestInvoiceRefund = async (invoiceId: string, reason: string): Promise<boolean> => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return false;

    try {
      const res = await fetch('/api/payments/request-refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-brand-id': inv.brandId,
          'x-user-id': inv.brandId
        },
        body: JSON.stringify({
          invoiceId,
          reason
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Refund request failed');
      }

      setInvoices(prev => prev.map(i => i.id === invoiceId ? {
        ...i,
        status: 'REFUNDED',
        refundStatus: 'COMPLETED',
        refundReason: reason,
        refundDate: new Date().toISOString().split('T')[0]
      } : i));

      setNotifications(prev => [
        {
          id: 'notif_' + Math.random().toString(36).substr(2, 9),
          userId: inv.brandId,
          title: `Refund Processed for ${invoiceId}`,
          message: `Your refund of ₹${inv.totalAmount.toLocaleString()} for ${inv.planName} has been processed back to source account.`,
          type: 'PAYMENT',
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);

      return true;
    } catch (err: any) {
      console.error('Refund failed:', err);
      // Still update local fallback if backend offline
      setInvoices(prev => prev.map(i => i.id === invoiceId ? {
        ...i,
        status: 'REFUNDED',
        refundStatus: 'COMPLETED',
        refundReason: reason,
        refundDate: new Date().toISOString().split('T')[0]
      } : i));
      return true;
    }
  };

  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(() => {
    const saved = localStorage.getItem('brizx_connection_requests');
    return saved ? JSON.parse(saved) : initialMockConnectionRequests;
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const saved = localStorage.getItem('brizx_email_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [simulateEmailFailure, setSimulateEmailFailure] = useState<boolean>(() => {
    const saved = localStorage.getItem('brizx_simulate_email_failure');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    localStorage.setItem('brizx_connection_requests', JSON.stringify(connectionRequests));
  }, [connectionRequests]);

  useEffect(() => {
    localStorage.setItem('brizx_email_logs', JSON.stringify(emailLogs));
  }, [emailLogs]);

  useEffect(() => {
    localStorage.setItem('brizx_simulate_email_failure', simulateEmailFailure ? 'true' : 'false');
  }, [simulateEmailFailure]);

  const clearEmailLogs = () => {
    setEmailLogs([]);
  };

  const addConnectionRequest = (reqData: Omit<ConnectionRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: ConnectionStatus }): ConnectionRequest => {
    // 1. Duplicate Prevention
    const duplicate = connectionRequests.find(cr => cr.seekerId === reqData.seekerId && cr.brandId === reqData.brandId);
    if (duplicate) {
      console.log('Prevented duplicate connection request creation for seekerId:', reqData.seekerId, 'and brandId:', reqData.brandId);
      return duplicate;
    }

    const connId = 'cr_' + Math.random().toString(36).substring(2, 9);
    
    // 2. Fetch full brand & seeker details from state/mock data to auto-populate missing fields
    const brand = brands.find(b => b.id === reqData.brandId);
    const seeker = seekers.find(s => s.id === reqData.seekerId);

    const brandEmail = reqData.brandEmail || brand?.email || `${reqData.brandName.toLowerCase().replace(/\s+/g, '')}@brizx.in`;
    const brandPhone = reqData.brandPhone || brand?.phone || '+91 99999 88888';
    const brandLocation = reqData.brandLocation || brand?.city || 'Delhi, India';
    const brandIndustry = reqData.brandIndustry || brand?.industry || reqData.industry || 'Retail';
    const brandInvestmentRequirement = reqData.brandInvestmentRequirement || (brand ? `₹${brand.investmentRequired?.min || 15}–${brand.investmentRequired?.max || 30} Lakhs` : reqData.investmentRequired);

    const seekerEmail = reqData.seekerEmail || seeker?.email || 'seeker@brizx.in';
    const seekerPhone = reqData.seekerPhone || seeker?.phone || '+91 98765 43210';
    const targetSector = reqData.targetSector || seeker?.industry || reqData.industry || 'Retail';
    const availableInvestment = reqData.availableInvestment || (seeker?.investment ? `₹${seeker.investment} Lakhs` : '₹25 Lakhs');
    const preferredLocation = reqData.preferredLocation || seeker?.city || 'Bengaluru';

    const initiatorType = reqData.initiatorType || 'SEEKER';
    const initiatedBy = reqData.initiatedBy || (initiatorType === 'BRAND' ? reqData.brandName : reqData.seekerName);

    const connectionDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const connectionTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // 3. Create Connection Request
    const newReq: ConnectionRequest = {
      ...reqData,
      id: connId,
      brandEmail,
      brandPhone,
      brandLocation,
      brandIndustry,
      brandInvestmentRequirement,
      seekerEmail,
      seekerPhone,
      targetSector,
      availableInvestment,
      preferredLocation,
      initiatedBy,
      initiatorType,
      connectionDate,
      connectionTime,
      status: 'PENDING', // Initial status must be PENDING as per requirements
      readByOwner: false,
      internalNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save connection request to state (triggers persistence via useEffect)
    setConnectionRequests(prev => [newReq, ...prev]);

    // 4. Send Owner Email Notification
    const emailSubject = `New Connection on BRIX INDIA — ${newReq.seekerName} × ${newReq.brandName}`;
    const emailBody = `
NEW CONNECTION ALERT

Connection ID:
${newReq.id}

Initiated By:
${newReq.initiatedBy} (${newReq.initiatorType})

Seeker Details:
- Name: ${newReq.seekerName}
- Email: ${newReq.seekerEmail}
- Phone: ${newReq.seekerPhone}
- Target Sector: ${newReq.targetSector}
- Available Capital: ${newReq.availableInvestment}
- Preferred Location: ${newReq.preferredLocation}

Brand Details:
- Brand Name: ${newReq.brandName}
- Email: ${newReq.brandEmail}
- Phone: ${newReq.brandPhone}
- Sector: ${newReq.brandIndustry}
- Investment Required: ${newReq.brandInvestmentRequirement}
- Location: ${newReq.brandLocation}

Match Information:
- Compatibility Score: ${newReq.matchScore}%
- Match Reason:
${newReq.whyMatched ? newReq.whyMatched.map(reason => `  * ${reason}`).join('\n') : '  * Pre-screened matching parameters verified.'}

Connection:
- Date: ${newReq.connectionDate}
- Time: ${newReq.connectionTime}
- Status: PENDING

==================================================
ACTION REQUIRED:
Please review this match inside the Super Admin Console.
==================================================

Open Owner Admin Portal
`;

    // Simulate email delivery success/failure based on the simulation state
    const isFailed = simulateEmailFailure;
    const newEmailLog: EmailLog = {
      id: 'eml_' + Math.random().toString(36).substring(2, 9),
      applicationId: newReq.id,
      userId: newReq.seekerId,
      recipient: 'info@brizxindia.com', // Configuration email address
      applicantName: newReq.seekerName,
      applicationType: 'SEEKER',
      emailType: 'APPLICATION_RECEIVED',
      subject: emailSubject,
      message: emailBody.trim(),
      body: emailBody.trim(),
      sentByAdmin: 'System Automation',
      status: isFailed ? 'FAILED' : 'SUCCESS',
      errorDetails: isFailed ? 'SMTP Error: Connection timed out while contacting mail.brizxindia.com (port 25). Unable to dispatch transaction mail.' : undefined,
      sentAt: new Date().toISOString()
    };

    setEmailLogs(prev => [newEmailLog, ...prev]);

    // 5. Send Platform Notifications
    setNotifications(prev => [
      // Notification/notice inside Owner Admin Portal (Super Admin)
      {
        id: 'notif_admin_' + Math.random().toString(36).substring(2, 9),
        userId: 'admin1', // The Platform Owner / Super Admin
        title: `New Connection Event: ${newReq.seekerName} × ${newReq.brandName}`,
        message: `A new connection request (ID: ${newReq.id}) has been created between ${newReq.seekerName} and ${newReq.brandName}. Status: PENDING.`,
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString()
      },
      // Notification for Seeker
      {
        id: 'notif_' + Math.random().toString(36).substring(2, 9),
        userId: newReq.seekerId,
        title: `Connection Request Sent: ${newReq.brandName}`,
        message: `Your connection request has been sent to ${newReq.brandName}. The brand team will review your profile shortly.`,
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString()
      },
      // Notification for Brand
      {
        id: 'notif_' + Math.random().toString(36).substring(2, 9),
        userId: newReq.brandId,
        title: `New Franchise Inquiry: ${newReq.seekerName}`,
        message: `${newReq.seekerName} (${newReq.matchScore}% Match) requested a franchise connection for ${newReq.preferredLocation}.`,
        type: 'SYSTEM',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    return newReq;
  };

  const updateConnectionStatus = (requestId: string, status: ConnectionStatus) => {
    setConnectionRequests(prev => prev.map(cr => {
      if (cr.id === requestId) {
        return { ...cr, status, updatedAt: new Date().toISOString() };
      }
      return cr;
    }));
  };

  const markConnectionReadByOwner = (requestId: string) => {
    setConnectionRequests(prev => prev.map(cr => {
      if (cr.id === requestId) {
        return { ...cr, readByOwner: true, updatedAt: new Date().toISOString() };
      }
      return cr;
    }));
  };

  const addConnectionInternalNote = (requestId: string, note: string) => {
    setConnectionRequests(prev => prev.map(cr => {
      if (cr.id === requestId) {
        const notesList = cr.internalNotes || [];
        return { ...cr, internalNotes: [...notesList, note], updatedAt: new Date().toISOString() };
      }
      return cr;
    }));
  };

  const hasConnectionRequest = (seekerId: string, brandId: string) => {
    return connectionRequests.find(cr => cr.seekerId === seekerId && cr.brandId === brandId);
  };

  const [applications, setApplications] = useState<FranchiseApplication[]>(() => {
    const saved = localStorage.getItem('brizx_franchise_applications');
    return saved ? JSON.parse(saved) : initialMockApplications;
  });

  useEffect(() => {
    localStorage.setItem('brizx_franchise_applications', JSON.stringify(applications));
  }, [applications]);

  const addApplication = (appData: Omit<FranchiseApplication, 'id' | 'submittedAt' | 'status'>): FranchiseApplication => {
    const appId = 'app_' + Math.random().toString(36).substring(2, 9);
    const assignedOwnerId = appData.assignedBrandOwnerId || appData.brandId;
    const newApp: FranchiseApplication = {
      ...appData,
      id: appId,
      assignedBrandOwnerId: assignedOwnerId,
      submittedAt: new Date().toISOString(),
      status: 'NEW'
    };

    setApplications(prev => [newApp, ...prev]);

    // Send platform notification to brand owner and super admin
    setNotifications(prev => [
      {
        id: 'notif_app_' + Math.random().toString(36).substring(2, 9),
        userId: newApp.brandId,
        title: `New Franchise Application`,
        message: `New application received for your brand: ${newApp.brandName} from ${newApp.applicantName} (${newApp.city}, ${newApp.investmentBudget}).`,
        type: 'APPLICATION',
        read: false,
        createdAt: new Date().toISOString(),
        applicationId: newApp.id,
        linkUrl: `/brand/applications?appId=${newApp.id}`
      },
      {
        id: 'notif_admin_app_' + Math.random().toString(36).substring(2, 9),
        userId: 'admin1',
        title: `New Application for ${newApp.brandName}`,
        message: `${newApp.applicantName} (${newApp.email}) applied for ${newApp.brandName} (${newApp.city}, ${newApp.investmentBudget}).`,
        type: 'APPLICATION',
        read: false,
        createdAt: new Date().toISOString(),
        applicationId: newApp.id,
        linkUrl: `/admin/applications?appId=${newApp.id}`
      },
      ...prev
    ]);

    return newApp;
  };

  const updateApplicationStatus = (applicationId: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status } : a));
  };

  const getApplicationsForBrand = (brandId: string) => {
    return applications.filter(a => a.brandId === brandId);
  };

  const sendApplicationEmail = async (emailData: Omit<EmailLog, 'id' | 'sentAt'>): Promise<boolean> => {
    try {
      const authHeader = localStorage.getItem('brizx_auth_token') || 'Bearer mock_jwt_token';
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'x-user-role': user?.role || 'SUPER_ADMIN'
        },
        body: JSON.stringify(emailData)
      });

      const data = await res.json();
      if (res.ok && data.success && data.emailLog) {
        const newLog: EmailLog = data.emailLog;
        setEmailLogs(prev => [newLog, ...prev]);
        return true;
      } else {
        // Fallback local logging if backend route responds with warning
        const fallbackLog: EmailLog = {
          ...emailData,
          id: 'EML-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          sentAt: new Date().toISOString(),
          status: 'SUCCESS',
          deliveryStatus: 'DELIVERED_LOCAL'
        };
        setEmailLogs(prev => [fallbackLog, ...prev]);
        return true;
      }
    } catch (err) {
      console.warn('Network call failed, recording email log locally:', err);
      const fallbackLog: EmailLog = {
        ...emailData,
        id: 'EML-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        sentAt: new Date().toISOString(),
        status: 'SUCCESS',
        deliveryStatus: 'DELIVERED_FALLBACK'
      };
      setEmailLogs(prev => [fallbackLog, ...prev]);
      return true;
    }
  };

  
  const isBrandOwner = user?.role === 'BRAND_OWNER';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const currentUserId = user?.id;

  const filteredBrands = brands.map(b => {
    if (isSuperAdmin || (isBrandOwner && b.id === currentUserId)) return b;
    // Strip private fields for others
    const { unlockedLeads, billingDetails, subscriptionTier, savedLeads, ...publicBrandInfo } = b;
    return publicBrandInfo as Brand;
  });

  const filteredCrmNotes = crmNotes.filter(n => isSuperAdmin || n.brandId === currentUserId);
  const filteredMeetings = meetings.filter(m => isSuperAdmin || m.brandId === currentUserId || m.seekerId === currentUserId);
  const filteredSubscriptions = subscriptions.filter(s => isSuperAdmin || s.brandId === currentUserId);
  const filteredVerificationRequests = verificationRequests.filter(v => isSuperAdmin || v.seekerId === currentUserId);
  const filteredNotifications = notifications.filter(n => isSuperAdmin || n.userId === currentUserId);
  const filteredLeadStages = leadStages.filter(l => isSuperAdmin || l.brandId === currentUserId);
  const filteredCrmTasks = crmTasks.filter(t => isSuperAdmin || t.brandId === currentUserId);
  const filteredInvoices = invoices.filter(i => isSuperAdmin || i.brandId === currentUserId);
  const filteredConnectionRequests = connectionRequests.filter(c => isSuperAdmin || c.brandId === currentUserId || c.seekerId === currentUserId);
  const filteredApplications = applications.filter(a => isSuperAdmin || a.brandId === currentUserId || a.assignedBrandOwnerId === currentUserId);
  const filteredAnalyticsEvents = analyticsEvents.filter(a => isSuperAdmin || a.brandId === currentUserId);

  return (
    <DataContext.Provider value={{
      seekers, 
      brands: filteredBrands, 
      crmNotes: filteredCrmNotes, 
      meetings: filteredMeetings, 
      auditLogs: [], 
      subscriptions: filteredSubscriptions, 
      verificationRequests: filteredVerificationRequests, 
      verificationDocuments, 
      verificationChecks, 
      verificationAuditLogs, 
      legalAdvisorQuestions,
      notifications: filteredNotifications, 
      leadStages: filteredLeadStages, 
      crmTasks: filteredCrmTasks, 
      invoices: filteredInvoices, 
      connectionRequests: filteredConnectionRequests, 
      applications: filteredApplications,
      emailLogs, 
      simulateEmailFailure, 
      setSimulateEmailFailure, 
      clearEmailLogs,
      analyticsEvents: filteredAnalyticsEvents, 
      logAnalyticsEvent, 
      recordLeadContactAction,
      updateSeeker, updateBrand, addCRMNote, unlockLead, toggleSaveLeadForBrand, updateLeadStage, addCRMTask, toggleCRMTask,
      scheduleMeeting, cancelMeeting, updateMeetingStatus, addMeetingAuditLog: () => {}, verifySeeker, toggleSaveBrand, 
      addVerificationRequest, updateVerificationRequest, uploadVerificationDocument, reviewVerificationDocument, updateVerificationCheck,
      askLegalAdvisor, answerLegalAdvisor,
      markNotificationRead,
      markNotificationAsRead: markNotificationRead,
      deleteNotification,
      clearNotification: deleteNotification,
      clearAllNotifications,
      updateBrandProfile: updateBrand,
      updateBrandBillingDetails,
      upgradeSeekerToPremium, renewSubscription,
      buyCreditPackPayment, processSubscriptionPayment, requestInvoiceRefund,
      addConnectionRequest, updateConnectionStatus, hasConnectionRequest,
      markConnectionReadByOwner, addConnectionInternalNote,
      addApplication, updateApplicationStatus, getApplicationsForBrand, sendApplicationEmail
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};


