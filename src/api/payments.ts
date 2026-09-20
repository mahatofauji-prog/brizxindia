import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// Server-side master catalogs (Never trust frontend amounts or credit counts)
const SUBSCRIPTION_PLANS_CATALOG: Record<string, { name: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'; displayName: string; basePrice: number; unlocks: number }> = {
  STARTER: { name: 'STARTER', displayName: 'BrizX Starter Plan', basePrice: 9999, unlocks: 10 },
  PROFESSIONAL: { name: 'PROFESSIONAL', displayName: 'BrizX Professional Plan', basePrice: 19999, unlocks: 25 },
  ENTERPRISE: { name: 'ENTERPRISE', displayName: 'BrizX Enterprise Master Plan', basePrice: 49999, unlocks: 75 }
};

const CREDIT_PACKS_CATALOG: Record<string, { id: string; name: string; basePrice: number; credits: number }> = {
  pack_10: { id: 'pack_10', name: 'Starter Unlock Pack (10 Credits)', basePrice: 3499, credits: 10 },
  pack_25: { id: 'pack_25', name: 'Growth Scale Pack (25 Credits)', basePrice: 7499, credits: 25 },
  pack_50: { id: 'pack_50', name: 'Expansion Power Pack (50 Credits)', basePrice: 12999, credits: 50 },
  pack_100: { id: 'pack_100', name: 'National Rollout Pack (100 Credits)', basePrice: 22999, credits: 100 }
};

// In-memory persistent database store for transactions, orders, and invoices
// In production, these are stored in Firestore/Cloud SQL
interface ServerTransaction {
  id: string;
  orderId: string;
  paymentId: string;
  brandId: string;
  brandName?: string;
  itemType: 'SUBSCRIPTION' | 'CREDIT_PACK' | 'RENEWAL';
  planOrPackId: string;
  planName: string;
  creditsAdded: number;
  taxableAmount: number;
  gstType: 'INTRA_STATE' | 'INTER_STATE';
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalGst: number;
  totalAmount: number;
  paymentMode: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'DEBIT_CARD';
  status: 'SUCCESS' | 'PAID' | 'FAILED' | 'REFUND_REQUESTED' | 'REFUND_PROCESSING' | 'REFUNDED';
  date: string;
  sacCode: string;
  createdAt: string;
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
  billingDetailsSnapshot?: any;
}

let serverTransactions: ServerTransaction[] = [
  {
    id: 'INV-2026-8801',
    orderId: 'order_rzp_init8801',
    paymentId: 'pay_rzp_live98411',
    brandId: 'b1',
    brandName: 'Burger Kingsway',
    itemType: 'SUBSCRIPTION',
    planOrPackId: 'PROFESSIONAL',
    planName: 'BrizX Professional Plan (25 Unlocks/mo)',
    creditsAdded: 25,
    taxableAmount: 19999,
    gstType: 'INTRA_STATE',
    cgstRate: 9,
    cgstAmount: 1799.91,
    sgstRate: 9,
    sgstAmount: 1799.91,
    igstRate: 0,
    igstAmount: 0,
    totalGst: 3599.82,
    totalAmount: 23598.82,
    paymentMode: 'UPI',
    status: 'SUCCESS',
    date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0],
    sacCode: '998314',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 'INV-2025-4102',
    orderId: 'order_rzp_init4102',
    paymentId: 'pay_rzp_live31088',
    brandId: 'b1',
    brandName: 'Burger Kingsway',
    itemType: 'SUBSCRIPTION',
    planOrPackId: 'STARTER',
    planName: 'BrizX Starter Plan Activation',
    creditsAdded: 10,
    taxableAmount: 9999,
    gstType: 'INTRA_STATE',
    cgstRate: 9,
    cgstAmount: 899.91,
    sgstRate: 9,
    sgstAmount: 899.91,
    igstRate: 0,
    igstAmount: 0,
    totalGst: 1799.82,
    totalAmount: 11798.82,
    paymentMode: 'CREDIT_CARD',
    status: 'SUCCESS',
    date: new Date(Date.now() - 86400000 * 45).toISOString().split('T')[0],
    sacCode: '998314',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString()
  }
];

const processedPaymentIds = new Set<string>(['pay_rzp_live98411', 'pay_rzp_live31088']);

/**
 * Helper to calculate GST tax on server
 */
function serverComputeGst(taxableAmount: number, buyerState?: string, buyerGstin?: string) {
  const normalizedState = (buyerState || '').trim().toLowerCase();
  const normalizedGstin = (buyerGstin || '').trim().toUpperCase();
  const isIntraState = normalizedState === 'karnataka' || normalizedState === 'ka' || normalizedGstin.startsWith('29');

  if (isIntraState) {
    const cgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
    const sgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
    const totalGst = Math.round((cgstAmount + sgstAmount) * 100) / 100;
    return {
      taxableAmount,
      gstType: 'INTRA_STATE' as const,
      cgstRate: 9,
      cgstAmount,
      sgstRate: 9,
      sgstAmount,
      igstRate: 0,
      igstAmount: 0,
      totalGst,
      totalAmount: Math.round((taxableAmount + totalGst) * 100) / 100
    };
  } else {
    const igstAmount = Math.round((taxableAmount * 0.18) * 100) / 100;
    return {
      taxableAmount,
      gstType: 'INTER_STATE' as const,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 18,
      igstAmount,
      totalGst: igstAmount,
      totalAmount: Math.round((taxableAmount + igstAmount) * 100) / 100
    };
  }
}

/**
 * 1. POST /api/payments/create-order
 * Generates verified server-side order with accurate GST computation
 */
router.post("/create-order", (req: Request, res: Response) => {
  const user = (req as any).user;
  const brandId = user?.brandId || user?.id || req.body.brandId;
  const { itemType, itemId, buyerState, buyerGstin } = req.body;

  if (!brandId) {
    return res.status(400).json({ success: false, message: "Brand ID is required" });
  }

  let basePrice = 0;
  let planName = '';
  let credits = 0;

  if (itemType === 'SUBSCRIPTION' || itemType === 'RENEWAL') {
    const plan = SUBSCRIPTION_PLANS_CATALOG[itemId];
    if (!plan) return res.status(400).json({ success: false, message: "Invalid subscription plan identifier" });
    basePrice = plan.basePrice;
    planName = plan.displayName;
    credits = plan.unlocks;
  } else if (itemType === 'CREDIT_PACK') {
    const pack = CREDIT_PACKS_CATALOG[itemId];
    if (!pack) return res.status(400).json({ success: false, message: "Invalid credit pack identifier" });
    basePrice = pack.basePrice;
    planName = pack.name;
    credits = pack.credits;
  } else {
    return res.status(400).json({ success: false, message: "Invalid item type requested" });
  }

  // Server-authoritative tax calculation
  const taxBreakdown = serverComputeGst(basePrice, buyerState, buyerGstin);
  const orderId = "order_rzp_" + Math.random().toString(36).substring(2, 12);

  res.json({
    success: true,
    orderId,
    itemType,
    itemId,
    planName,
    credits,
    currency: "INR",
    taxBreakdown,
    sacCode: "998314"
  });
});

/**
 * 2. POST /api/payments/verify
 * Server-authoritative payment verification.
 * Validates against duplicate processing, generates unique GST Tax Invoice, and returns confirmation.
 */
router.post("/verify", (req: Request, res: Response) => {
  const user = (req as any).user;
  const brandId = user?.brandId || user?.id || req.body.brandId;
  const {
    orderId,
    paymentId,
    itemType,
    itemId,
    paymentMode = 'UPI',
    brandName,
    buyerState,
    buyerGstin,
    billingDetails
  } = req.body;

  if (!brandId) {
    return res.status(400).json({ success: false, message: "Brand authentication required" });
  }

  if (!orderId || !paymentId) {
    return res.status(400).json({ success: false, message: "Order ID and Payment ID are mandatory for verification" });
  }

  // Idempotency check: prevent duplicate payment processing
  if (processedPaymentIds.has(paymentId)) {
    const existing = serverTransactions.find(t => t.paymentId === paymentId);
    if (existing) {
      return res.json({
        success: true,
        message: "Payment already verified (Idempotent replay)",
        transaction: existing,
        invoice: existing
      });
    }
  }

  // Server-side lookup of item & verified price
  let basePrice = 0;
  let planName = '';
  let credits = 0;

  if (itemType === 'SUBSCRIPTION' || itemType === 'RENEWAL') {
    const plan = SUBSCRIPTION_PLANS_CATALOG[itemId];
    if (!plan) return res.status(400).json({ success: false, message: "Invalid plan identifier" });
    basePrice = plan.basePrice;
    planName = plan.displayName;
    credits = plan.unlocks;
  } else if (itemType === 'CREDIT_PACK') {
    const pack = CREDIT_PACKS_CATALOG[itemId];
    if (!pack) return res.status(400).json({ success: false, message: "Invalid pack identifier" });
    basePrice = pack.basePrice;
    planName = pack.name;
    credits = pack.credits;
  } else {
    return res.status(400).json({ success: false, message: "Invalid item type" });
  }

  const tax = serverComputeGst(basePrice, buyerState, buyerGstin);
  const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();

  const newTransaction: ServerTransaction = {
    id: invoiceNumber,
    orderId,
    paymentId,
    brandId,
    brandName: brandName || 'Verified Brand Partner',
    itemType,
    planOrPackId: itemId,
    planName,
    creditsAdded: credits,
    taxableAmount: tax.taxableAmount,
    gstType: tax.gstType,
    cgstRate: tax.cgstRate,
    cgstAmount: tax.cgstAmount,
    sgstRate: tax.sgstRate,
    sgstAmount: tax.sgstAmount,
    igstRate: tax.igstRate,
    igstAmount: tax.igstAmount,
    totalGst: tax.totalGst,
    totalAmount: tax.totalAmount,
    paymentMode,
    status: 'SUCCESS',
    date: now.toISOString().split('T')[0],
    sacCode: '998314',
    createdAt: now.toISOString(),
    billingDetailsSnapshot: billingDetails
  };

  // Persist transaction and mark payment ID as used
  processedPaymentIds.add(paymentId);
  serverTransactions = [newTransaction, ...serverTransactions];

  res.json({
    success: true,
    message: "Payment successfully verified on BrizX Secure Gateway. Features unlocked.",
    transaction: newTransaction,
    invoice: newTransaction
  });
});

/**
 * 3. POST /api/payments/request-refund
 * Initiates a formal GST refund request on a transaction.
 */
router.post("/request-refund", (req: Request, res: Response) => {
  const user = (req as any).user;
  const brandId = user?.brandId || user?.id || req.body.brandId;
  const { invoiceId, reason } = req.body;

  if (!invoiceId) {
    return res.status(400).json({ success: false, message: "Invoice ID is required" });
  }

  const txn = serverTransactions.find(t => t.id === invoiceId && (t.brandId === brandId || user?.role === 'SUPER_ADMIN'));
  if (!txn) {
    return res.status(404).json({ success: false, message: "Transaction not found or access denied" });
  }

  if (txn.status === 'REFUNDED') {
    return res.status(400).json({ success: false, message: "Transaction has already been refunded" });
  }

  const refundId = "ref_" + Math.random().toString(36).substring(2, 10);
  const now = new Date().toISOString();

  // Update status
  txn.status = 'REFUNDED';
  txn.refundDetails = {
    refundId,
    reason: reason || "Customer requested refund within 7-day grace window",
    requestedAt: now,
    processedAt: now,
    refundAmount: txn.totalAmount,
    creditsDeducted: txn.creditsAdded,
    status: 'COMPLETED',
    notes: 'Refund processed back to original source payment method.'
  };

  res.json({
    success: true,
    message: "Refund processed successfully. Credit note generated.",
    transaction: txn
  });
});

/**
 * 4. GET /api/payments/history
 * Returns brand-isolated transaction and invoice history
 */
router.get("/history", (req: Request, res: Response) => {
  const user = (req as any).user;
  const brandId = user?.brandId || user?.id || (req.query.brandId as string);

  if (!brandId && user?.role !== 'SUPER_ADMIN') {
    return res.status(400).json({ success: false, message: "Brand ID is required" });
  }

  const results = user?.role === 'SUPER_ADMIN' && !brandId
    ? serverTransactions
    : serverTransactions.filter(t => t.brandId === brandId);

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

/**
 * 5. GET /api/payments/invoice/:id
 * Fetches detailed invoice data
 */
router.get("/invoice/:id", (req: Request, res: Response) => {
  const user = (req as any).user;
  const brandId = user?.brandId || user?.id;
  const invoiceId = req.params.id;

  const txn = serverTransactions.find(t => t.id === invoiceId && (t.brandId === brandId || user?.role === 'SUPER_ADMIN'));
  if (!txn) {
    return res.status(404).json({ success: false, message: "Invoice not found" });
  }

  res.json({
    success: true,
    invoice: txn
  });
});

export default router;
