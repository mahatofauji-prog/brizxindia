import { BrandBillingDetails, CreditPack, PaymentInvoice } from '../types';

export interface BrizXCompanyProfile {
  legalName: string;
  tradeName: string;
  cin: string;
  gstin: string;
  pan: string;
  state: string;
  stateCode: string;
  sacCode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  email: string;
  supportPhone: string;
  website: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId: string;
  };
}

export const BRIZX_COMPANY_PROFILE: BrizXCompanyProfile = {
  legalName: 'BrizX India Technologies Private Limited',
  tradeName: 'BrizX India',
  cin: 'U72900KA2025PTC189201',
  gstin: '29AAACB9988A1Z2',
  pan: 'AAACB9988A',
  state: 'Karnataka',
  stateCode: '29',
  sacCode: '998314', // Information Technology Software and Platform Access Services
  addressLine1: 'Level 4, BrizX Innovation Tower',
  addressLine2: 'Outer Ring Road, Bellandur',
  city: 'Bengaluru',
  pincode: '560103',
  email: 'billing@brizxindia.com',
  supportPhone: '+91 80 4920 1800',
  website: 'https://brizx.in',
  bankDetails: {
    bankName: 'HDFC Bank Ltd',
    accountName: 'BrizX India Tech Pvt Ltd',
    accountNumber: '50200088991122',
    ifscCode: 'HDFC0001742',
    branch: 'Outer Ring Road Bellandur, Bengaluru',
    upiId: 'brizxindia@hdfcbank'
  }
};

export const INDIAN_STATES: { name: string; code: string }[] = [
  { name: 'Karnataka', code: '29' },
  { name: 'Maharashtra', code: '27' },
  { name: 'Delhi', code: '07' },
  { name: 'Telangana', code: '36' },
  { name: 'Tamil Nadu', code: '33' },
  { name: 'Gujarat', code: '24' },
  { name: 'Haryana', code: '06' },
  { name: 'Uttar Pradesh', code: '09' },
  { name: 'West Bengal', code: '19' },
  { name: 'Rajasthan', code: '08' },
  { name: 'Kerala', code: '32' },
  { name: 'Andhra Pradesh', code: '37' },
  { name: 'Punjab', code: '03' },
  { name: 'Madhya Pradesh', code: '23' },
  { name: 'Bihar', code: '10' },
  { name: 'Odisha', code: '21' },
  { name: 'Goa', code: '30' },
  { name: 'Chandigarh', code: '04' },
  { name: 'Assam', code: '18' },
  { name: 'Jharkhand', code: '20' },
  { name: 'Uttarakhand', code: '05' },
  { name: 'Himachal Pradesh', code: '02' },
  { name: 'Jammu and Kashmir', code: '01' },
  { name: 'Puducherry', code: '34' }
];

export const SUBSCRIPTION_PLANS = {
  STARTER: {
    name: 'STARTER' as const,
    displayName: 'BrizX Starter Plan',
    pricePerMonth: 9999,
    unlocksPerMonth: 10,
    period: 'per month',
    description: 'Essential lead unlocks and smart matching for regional brand expansion.',
    features: [
      '10 Verified Lead Unlocks / mo',
      'Smart Match Precision Engine (100-pt algorithm)',
      'Basic CRM & Contact Activity Notes',
      'Standard Email & Ticket Support',
      'Instant GST Tax Invoices with ITC eligibility'
    ]
  },
  PROFESSIONAL: {
    name: 'PROFESSIONAL' as const,
    displayName: 'BrizX Professional Plan',
    pricePerMonth: 19999,
    unlocksPerMonth: 25,
    period: 'per month',
    popular: true,
    description: 'High-growth franchise pipeline management for scaling across Tier-1 & Tier-2 hubs.',
    features: [
      '25 Verified Lead Unlocks / mo',
      'Priority Smart Match & Regional Lead Alerts',
      'Advanced CRM Funnel Pipeline & Tasks',
      'Direct Video Meeting Scheduler & Calendar Sync',
      'Territory Demand & Intelligence Heatmap',
      'Priority Response SLA & Relationship Desk'
    ]
  },
  ENTERPRISE: {
    name: 'ENTERPRISE' as const,
    displayName: 'BrizX Enterprise Master Plan',
    pricePerMonth: 49999,
    unlocksPerMonth: 75,
    period: 'per month',
    description: 'Full-scale national expansion engine with dedicated key account support and API webhooks.',
    features: [
      '75 Verified Lead Unlocks / mo',
      'Dedicated Key Account Director & Legal Advisory',
      'Custom CRM Webhook & Lead API Integrations',
      'Featured Brand Spotlight Badge across Portal',
      'Unlimited Video Discovery Meetings',
      'Custom FDD & LOI Agreement Templates'
    ]
  }
};

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'pack_10',
    name: 'Starter Unlock Pack',
    credits: 10,
    price: 3499,
    perCreditPrice: 349.9,
    description: '10 verified franchise seeker direct contact unlocks.'
  },
  {
    id: 'pack_25',
    name: 'Growth Scale Pack',
    credits: 25,
    price: 7499,
    popular: true,
    badge: 'Best Value',
    perCreditPrice: 299.96,
    description: '25 verified seeker unlocks with priority delivery.'
  },
  {
    id: 'pack_50',
    name: 'Expansion Power Pack',
    credits: 50,
    price: 12999,
    badge: 'Popular',
    perCreditPrice: 259.98,
    description: '50 verified seeker unlocks for active territory campaigns.'
  },
  {
    id: 'pack_100',
    name: 'National Rollout Pack',
    credits: 100,
    price: 22999,
    badge: 'Lowest Rate',
    perCreditPrice: 229.99,
    description: '100 verified seeker unlocks for enterprise franchise campaigns.'
  }
];

export interface GstTaxBreakdown {
  taxableAmount: number;
  baseAmount: number; // alias for taxableAmount
  gstType: 'INTRA_STATE' | 'INTER_STATE';
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalGst: number;
  gstAmount: number; // alias for totalGst
  totalAmount: number;
  placeOfSupply: string;
}

/**
 * Computes official Indian GST breakdown based on buyer's state and supplier's location (Karnataka - 29)
 */
export function calculateGstBreakdown(taxableAmount: number, buyerState?: string, buyerGstin?: string): GstTaxBreakdown {
  let isIntraState = false;

  const normalizedState = (buyerState || '').trim().toLowerCase();
  const normalizedGstin = (buyerGstin || '').trim().toUpperCase();

  const placeOfSupply = buyerState ? buyerState.trim() : 'Not Provided';

  if (normalizedState === 'karnataka' || normalizedState === 'ka') {
    isIntraState = true;
  } else if (normalizedGstin.length >= 2 && normalizedGstin.startsWith('29')) {
    isIntraState = true;
  }

  if (isIntraState) {
    const cgstRate = 9;
    const sgstRate = 9;
    const cgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
    const sgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
    const totalGst = Math.round((cgstAmount + sgstAmount) * 100) / 100;
    const totalAmount = Math.round((taxableAmount + totalGst) * 100) / 100;

    return {
      taxableAmount,
      baseAmount: taxableAmount,
      gstType: 'INTRA_STATE',
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate: 0,
      igstAmount: 0,
      totalGst,
      gstAmount: totalGst,
      totalAmount,
      placeOfSupply
    };
  } else {
    const igstRate = 18;
    const igstAmount = Math.round((taxableAmount * 0.18) * 100) / 100;
    const totalGst = igstAmount;
    const totalAmount = Math.round((taxableAmount + totalGst) * 100) / 100;

    return {
      taxableAmount,
      baseAmount: taxableAmount,
      gstType: 'INTER_STATE',
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate,
      igstAmount,
      totalGst,
      gstAmount: totalGst,
      totalAmount,
      placeOfSupply
    };
  }
}

/**
 * Validates 15-character Indian GSTIN format
 * Format: 2 digits (State Code) + 10 chars (PAN) + 1 digit (Entity code) + 'Z' + 1 checksum char
 */
export function validateGstin(gstin: string): { isValid: boolean; message: string; stateCode?: string; stateName?: string } {
  if (!gstin) {
    return { isValid: false, message: 'GSTIN cannot be empty' };
  }

  const clean = gstin.trim().toUpperCase();
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (clean.length !== 15) {
    return { isValid: false, message: 'GSTIN must be exactly 15 alphanumeric characters' };
  }

  if (!gstinRegex.test(clean)) {
    return { isValid: false, message: 'Invalid GSTIN structure (e.g. 29AABCB1234F1Z5)' };
  }

  const stateCode = clean.substring(0, 2);
  const matchedState = INDIAN_STATES.find(s => s.code === stateCode);

  return {
    isValid: true,
    message: `Valid GSTIN (${matchedState ? matchedState.name : `State code: ${stateCode}`})`,
    stateCode,
    stateName: matchedState?.name
  };
}

/**
 * Converts numbers into standard Indian Rupee words (e.g. for tax invoice total display)
 */
export function convertNumberToIndianWords(amount: number): string {
  const rounded = Math.floor(amount);
  const paise = Math.round((amount - rounded) * 100);

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n < 20) return ones[n];
    const unit = n % 10;
    return tens[Math.floor(n / 10)] + (unit ? ' ' + ones[unit] : '');
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let str = '';
    if (hundred) str += ones[hundred] + ' Hundred';
    if (rest) str += (str ? ' and ' : '') + convertTwoDigits(rest);
    return str;
  }

  if (rounded === 0) return 'Rupees Zero Only';

  let remaining = rounded;
  const crores = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  const lakhs = Math.floor(remaining / 100000);
  remaining %= 100000;
  const thousands = Math.floor(remaining / 1000);
  remaining %= 1000;
  const hundredsAndBelow = remaining;

  const parts: string[] = [];
  if (crores) parts.push(convertThreeDigits(crores) + ' Crore');
  if (lakhs) parts.push(convertTwoDigits(lakhs) + ' Lakh');
  if (thousands) parts.push(convertTwoDigits(thousands) + ' Thousand');
  if (hundredsAndBelow) parts.push(convertThreeDigits(hundredsAndBelow));

  let words = 'Rupees ' + parts.join(' ');
  if (paise > 0) {
    words += ' and ' + convertTwoDigits(paise) + ' Paise';
  }
  words += ' Only';

  return words;
}
