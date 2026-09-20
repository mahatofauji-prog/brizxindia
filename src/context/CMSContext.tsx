import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for Enterprise CMS
export interface HeroSectionConfig {
  headline: string;
  subheading: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroImages: string[];
  autoSlideInterval: number;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  trend: string;
}

export interface TrustedBrandItem {
  id: string;
  name: string;
  logo: string;
}

export interface HomepageSectionOrder {
  id: string;
  name: string;
  enabled: boolean;
}

export interface AboutPageConfig {
  companyName: string;
  tagline: string;
  vision: string;
  mission: string;
  companyStory: string;
  founderDetails: {
    name: string;
    role: string;
    bio: string;
    image: string;
    linkedin: string;
  }[];
  teamMembers: {
    id: string;
    name: string;
    role: string;
    image: string;
  }[];
  timeline: {
    year: string;
    title: string;
    description: string;
  }[];
  companyImages: string[];
  whyChooseUs: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  icon: string;
  bannerImage: string;
  shortDescription: string;
  fullDescription: string;
  enabled: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  publishDate: string;
  featuredImage: string;
  summary: string;
  content: string;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  scheduledAt?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
}

export interface FAQItem {
  id: string;
  category: 'SEEKER' | 'BRAND' | 'GENERAL' | 'LEGAL' | 'PRICING';
  question: string;
  answer: string;
  order: number;
  enabled: boolean;
}

export interface TestimonialItem {
  id: string;
  customerName: string;
  businessName: string;
  role: string;
  customerImage: string;
  rating: number;
  quote: string;
  featured: boolean;
  enabled: boolean;
}

export interface PricingPlanItem {
  id: string;
  name: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice: number;
  gstPercentage: number;
  unlockCredits: number;
  features: string[];
  discountCode?: string;
  discountPercent?: number;
  visible: boolean;
  highlighted: boolean;
}

export interface MediaFile {
  id: string;
  fileName: string;
  fileType: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'ICON' | 'LOGO' | 'BANNER';
  url: string;
  sizeKb: number;
  uploadedAt: string;
  folder: string;
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogImage: string;
  twitterCard: string;
  schemaMarkup: string;
  robotsTxt: string;
  sitemapXml: string;
  googleAnalyticsId: string;
  googleSearchConsoleTag: string;
  facebookPixelId: string;
}

export interface ContactConfig {
  businessName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapEmbedUrl: string;
  businessHours: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    twitter: string;
  };
}

export interface WebsiteLead {
  id: string;
  type: 'CONTACT' | 'CONSULTATION' | 'MEETING' | 'DEMO';
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'ASSIGNED' | 'CONVERTED' | 'CLOSED';
  assignedStaff?: string;
  createdAt: string;
}

export interface AppearanceConfig {
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  fontFamily: string;
  darkModeDefault: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  target?: '_blank' | '_self';
  children?: MenuItem[];
  order: number;
}

export interface FooterConfig {
  quickLinks: { label: string; url: string }[];
  serviceLinks: { label: string; url: string }[];
  policyLinks: { label: string; url: string }[];
  copyrightText: string;
  newsletterHeadline: string;
  newsletterSubtext: string;
}

export interface RevisionHistoryItem {
  id: string;
  section: string;
  timestamp: string;
  modifiedBy: string;
  summary: string;
}

interface CMSContextType {
  hero: HeroSectionConfig;
  setHero: React.Dispatch<React.SetStateAction<HeroSectionConfig>>;
  stats: StatItem[];
  setStats: React.Dispatch<React.SetStateAction<StatItem[]>>;
  trustedBrands: TrustedBrandItem[];
  setTrustedBrands: React.Dispatch<React.SetStateAction<TrustedBrandItem[]>>;
  homepageSections: HomepageSectionOrder[];
  setHomepageSections: React.Dispatch<React.SetStateAction<HomepageSectionOrder[]>>;
  about: AboutPageConfig;
  setAbout: React.Dispatch<React.SetStateAction<AboutPageConfig>>;
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  blogs: BlogItem[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogItem[]>>;
  faqs: FAQItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
  testimonials: TestimonialItem[];
  setTestimonials: React.Dispatch<React.SetStateAction<TestimonialItem[]>>;
  pricingPlans: PricingPlanItem[];
  setPricingPlans: React.Dispatch<React.SetStateAction<PricingPlanItem[]>>;
  mediaFiles: MediaFile[];
  setMediaFiles: React.Dispatch<React.SetStateAction<MediaFile[]>>;
  seo: SEOConfig;
  setSeo: React.Dispatch<React.SetStateAction<SEOConfig>>;
  contact: ContactConfig;
  setContact: React.Dispatch<React.SetStateAction<ContactConfig>>;
  leads: WebsiteLead[];
  setLeads: React.Dispatch<React.SetStateAction<WebsiteLead[]>>;
  appearance: AppearanceConfig;
  setAppearance: React.Dispatch<React.SetStateAction<AppearanceConfig>>;
  headerMenu: MenuItem[];
  setHeaderMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  footer: FooterConfig;
  setFooter: React.Dispatch<React.SetStateAction<FooterConfig>>;
  revisions: RevisionHistoryItem[];
  addRevisionLog: (section: string, summary: string) => void;
  resetAllToDefault: () => void;
  saveStatus: 'SAVED' | 'SAVING' | 'UNSAVED';
  markUnsaved: () => void;
  saveChanges: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'brizx_enterprise_cms_v1';

const defaultHero: HeroSectionConfig = {
  headline: 'India’s #1 Verified Franchise Marketplace & Growth Accelerator',
  subheading: 'Connect directly with 1,200+ high-ROI brand founders or pre-screened investors across 45+ Tier-1 & Tier-2 cities.',
  primaryCtaText: 'Explore Verified Brands',
  primaryCtaLink: '/search',
  secondaryCtaText: 'List Your Franchise',
  secondaryCtaLink: '/register?role=BRAND_OWNER',
  heroImages: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200'
  ],
  autoSlideInterval: 5000,
};

const defaultStats: StatItem[] = [
  { id: 'st1', label: 'Verified Franchise Brands', value: '1,250+', trend: '+24% MoM' },
  { id: 'st2', label: 'Active Franchise Seekers', value: '18,900+', trend: '+35% MoM' },
  { id: 'st3', label: 'Successful Match Deals', value: '3,400+', trend: '98.2% Satisfaction' },
  { id: 'st4', label: 'Tier-2 & Tier-3 Cities Covered', value: '180+', trend: 'Pan-India Reach' },
];

const defaultTrustedBrands: TrustedBrandItem[] = [
  { id: 'tb1', name: 'Chai Point', logo: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200' },
  { id: 'tb2', name: 'Lenskart', logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200' },
  { id: 'tb3', name: 'KFC India', logo: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200' },
  { id: 'tb4', name: 'EuroKids', logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200' },
  { id: 'tb5', name: 'Subway', logo: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200' },
];

const defaultHomepageSections: HomepageSectionOrder[] = [
  { id: 'hero', name: 'Hero Carousel & Search Bar', enabled: true },
  { id: 'stats', name: 'Live Marketplace Statistics', enabled: true },
  { id: 'trusted_brands', name: 'Trusted Brand Logos Strip', enabled: true },
  { id: 'featured_brands', name: 'Featured Franchise Opportunities', enabled: true },
  { id: 'featured_seekers', name: 'Pre-Screened Franchise Seekers', enabled: true },
  { id: 'services', name: 'Franchise Expansion Services', enabled: true },
  { id: 'roi_calculator', name: 'Interactive ROI & Payback Calculator', enabled: true },
  { id: 'testimonials', name: 'Success Stories & Testimonials', enabled: true },
  { id: 'blogs', name: 'Industry Insights & Blog Posts', enabled: true },
  { id: 'faq', name: 'Frequently Asked Questions', enabled: true },
];

const defaultAbout: AboutPageConfig = {
  companyName: 'BrizX India Franchising Technologies Pvt Ltd',
  tagline: 'Architecting India’s Next Generation of Multi-Unit Business Founders',
  vision: 'To organize India’s unorganized franchising ecosystem into a transparent, data-driven, multi-billion-dollar economic engine.',
  mission: 'To empower 50,000+ Indian entrepreneurs to establish sustainable, high-ROI franchise outlets by 2030.',
  companyStory: 'Founded in 2024, BrizX India solved the core trust deficit in the franchise discovery landscape. By replacing manual brokers with legal verification, AI-powered investor matching, and standardized FDD disclosure documents, BrizX accelerated deal closure times from 6 months to 18 days.',
  founderDetails: [
    {
      name: 'Hariom Sharma',
      role: 'Founder & Managing Director',
      bio: 'Ex-Franchise Expansion Head with 12+ years of experience scaling 300+ QSR and Retail outlets across South Asia.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      linkedin: 'https://linkedin.com/in/hariom-brizx'
    }
  ],
  teamMembers: [
    { id: 'tm1', name: 'Priya Verma', role: 'Head of Brand Due Diligence', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
    { id: 'tm2', name: 'Vikramaditya Rao', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  ],
  timeline: [
    { year: '2024', title: 'Platform Launch', description: 'Bootstrapped BrizX with 50 verified brands in Bangalore and Mumbai.' },
    { year: '2025', title: 'Smart Match AI Engine', description: 'Introduced automated financial compatibility matching for investors.' },
    { year: '2026', title: 'Pan-India Enterprise Network', description: 'Crossed 1,200+ brands and 18,000+ verified franchise seekers.' },
  ],
  companyImages: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'
  ],
  whyChooseUs: [
    '100% Legal & FSSAI Due Diligence Audit',
    'Direct Founder-to-Investor Meetings',
    'AI-Calculated ROI & Payback Transparency',
    'Zero Middlemen & Transparent Pricing'
  ]
};

const defaultServices: ServiceItem[] = [
  {
    id: 'srv1',
    title: 'Brand Franchising Advisory',
    slug: 'brand-advisory',
    icon: 'Building2',
    bannerImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    shortDescription: 'Complete franchise modeling, FDD preparation, unit economics standardization, and legal agreement drafting.',
    fullDescription: 'We help emerging and established brands transition into scalable franchise networks. Our advisory team assists in royalty structure design, FOCO/FOFO framework customization, operating manuals, and legal compliance.',
    enabled: true,
    order: 1,
    metaTitle: 'Franchise Advisory Services India | BrizX',
    metaDescription: 'Scale your business model through standardized franchise advisory and legal agreement support.'
  },
  {
    id: 'srv2',
    title: 'AI Smart Match Lead Generation',
    slug: 'smart-match',
    icon: 'Sparkles',
    bannerImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    shortDescription: 'Algorithmically match your franchise opportunity with verified, high-net-worth investors in target cities.',
    fullDescription: 'Stop chasing cold leads. BrizX algorithm analyzes budget, space availability, past operational experience, and timeline to deliver 95% intent-matched franchise buyers.',
    enabled: true,
    order: 2,
    metaTitle: 'Targeted Franchise Lead Generation | BrizX Smart Match',
    metaDescription: 'Get pre-screened franchise investor leads matched by capital and geographic preference.'
  },
  {
    id: 'srv3',
    title: 'Location & Catchment Due Diligence',
    slug: 'location-due-diligence',
    icon: 'MapPin',
    bannerImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800',
    shortDescription: 'Footfall density analysis, competitor heatmapping, and rental ROI evaluation for target outlets.',
    fullDescription: 'Ensure retail success before signing lease agreements. Our GIS catchment tool models demographic spending, traffic density, and anchor tenant proximity.',
    enabled: true,
    order: 3,
    metaTitle: 'Franchise Store Location & Catchment Analysis | BrizX',
    metaDescription: 'Data-backed site selection and demographic heatmapping for maximum unit-level profitability.'
  }
];

const defaultBlogs: BlogItem[] = [
  {
    id: 'bl1',
    title: 'How to Choose the Right Franchise in India (2026 Comprehensive Guide)',
    slug: 'how-to-choose-franchise-india-2026',
    category: 'Franchise Guide',
    tags: ['Franchising', 'ROI', 'Unit Economics', 'Beginners'],
    author: 'BrizX Intel Team',
    authorRole: 'Market Research Division',
    publishDate: '2026-07-20',
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    summary: 'Essential factors to evaluate before investing in a franchise, from unit payback period to FOFO vs FOCO operational models.',
    content: 'Franchising in India is experiencing exponential growth, particularly across Tier-2 and Tier-3 urban markets. However, selecting the right brand requires looking beyond marketing brochures. Investors must conduct deep due diligence into FDD disclosures, gross margin sustainability, and master franchisee support structures...',
    featured: true,
    metaTitle: 'How to Choose the Right Franchise in India (2026 Guide)',
    metaDescription: 'Complete step-by-step guide on evaluating franchise payback periods, royalty structures, and brand verification.',
    status: 'PUBLISHED'
  },
  {
    id: 'bl2',
    title: 'FOFO vs FOCO Model: Which Delivers Higher ROI in QSR & Retail?',
    slug: 'fofo-vs-foco-model-roi-comparison',
    category: 'Business Models',
    tags: ['FOFO', 'FOCO', 'QSR', 'Investment'],
    author: 'Rahul Sharma',
    authorRole: 'Senior Franchise Strategist',
    publishDate: '2026-07-15',
    featuredImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    summary: 'A detailed breakdown comparing Franchise Owned Franchise Operated vs Franchise Owned Company Operated structures.',
    content: 'Choosing between FOFO and FOCO dictates your level of daily operational involvement. While FOFO provides higher profit shares (up to 85%), FOCO offers passive income secured by corporate management expertise...',
    featured: false,
    metaTitle: 'FOFO vs FOCO Model Comparison | BrizX Insights',
    metaDescription: 'Understand profit sharing, daily operational duties, and risk factors in FOFO vs FOCO franchise models.',
    status: 'PUBLISHED'
  }
];

const defaultFaqs: FAQItem[] = [
  {
    id: 'f1',
    category: 'SEEKER',
    question: 'How does BrizX verify franchise brands listed on the marketplace?',
    answer: 'Our due diligence team conducts a 14-point audit check covering legal registration (GST, PAN, MCA), FSSAI licenses, trademark certificates, unit profitability, and audited FDD financial disclosures.',
    order: 1,
    enabled: true
  },
  {
    id: 'f2',
    category: 'BRAND',
    question: 'How do Lead Unlocks work for Brand Owners?',
    answer: 'Brand owners use monthly unlock credits included in their subscription plan to reveal verified contact details (phone, email, net worth, target location) of high-intent franchise seekers.',
    order: 2,
    enabled: true
  },
  {
    id: 'f3',
    category: 'PRICING',
    question: 'Are there any hidden broker commissions charged by BrizX?',
    answer: 'No. BrizX operates on a transparent SaaS subscription model. We charge zero percentage commission on final franchise deal closures.',
    order: 3,
    enabled: true
  }
];

const defaultTestimonials: TestimonialItem[] = [
  {
    id: 't1',
    customerName: 'Vikram Sethi',
    businessName: 'Chai Point Outlet',
    role: 'Multi-Unit Franchisee, Indiranagar Blr',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    rating: 5,
    quote: 'BrizX connected me directly with Chai Point founders. The legal due diligence report gave me full confidence, and I closed my outlet deal in 18 days!',
    featured: true,
    enabled: true
  },
  {
    id: 't2',
    customerName: 'Ananya Roy',
    businessName: 'Scoop Artisan Gelato',
    role: 'Co-Founder & VP Expansion',
    customerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    rating: 5,
    quote: 'We generated over 45 high-intent, pre-screened franchise buyer leads in Pune and Surat within our first month on BrizX Enterprise. Phenomenal ROI!',
    featured: true,
    enabled: true
  }
];

const defaultPricingPlans: PricingPlanItem[] = [
  {
    id: 'p_starter',
    name: 'Starter Growth',
    badge: 'Emerging Brands',
    monthlyPrice: 49999,
    annualPrice: 449999,
    gstPercentage: 18,
    unlockCredits: 25,
    features: [
      '25 Verified Seeker Lead Unlocks / month',
      'Standard Brand Directory Listing',
      'CRM Pipeline Management',
      'Email & In-App Direct Chat',
      'Standard Support'
    ],
    discountCode: 'WELCOME10',
    discountPercent: 10,
    visible: true,
    highlighted: false
  },
  {
    id: 'p_pro',
    name: 'Professional Scale',
    badge: 'Most Popular',
    monthlyPrice: 149999,
    annualPrice: 1299999,
    gstPercentage: 18,
    unlockCredits: 100,
    features: [
      '100 Verified Seeker Lead Unlocks / month',
      'Featured Homepage & Sector Listing',
      'AI Smart Match Investor Recommendations',
      'Dedicated Key Account Manager',
      'Broadcast Center Access (Email + WhatsApp)',
      '1-on-1 Founder Consultation Scheduling'
    ],
    discountCode: 'SCALE20',
    discountPercent: 20,
    visible: true,
    highlighted: true
  },
  {
    id: 'p_enterprise',
    name: 'Enterprise Multi-Unit',
    badge: 'National Chains',
    monthlyPrice: 249999,
    annualPrice: 2199999,
    gstPercentage: 18,
    unlockCredits: 250,
    features: [
      '250 Verified Seeker Lead Unlocks / month',
      'Top Tier-1 Placement & Hero Carousel Spot',
      'Custom Catchment GIS Location Heatmapping',
      'Unlimited Staff CRM Sub-Accounts',
      'Priority Broadcast & Event Sponsorship',
      'Custom FDD Legal Document Hosting'
    ],
    discountCode: 'ENTERPRISE15',
    discountPercent: 15,
    visible: true,
    highlighted: false
  }
];

const defaultMediaFiles: MediaFile[] = [
  { id: 'm1', fileName: 'hero_banner_qsr.jpg', fileType: 'IMAGE', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', sizeKb: 450, uploadedAt: '2026-07-25', folder: 'Banners' },
  { id: 'm2', fileName: 'brizx_brand_pitch.pdf', fileType: 'DOCUMENT', url: 'https://brizx.in/docs/pitch.pdf', sizeKb: 2400, uploadedAt: '2026-07-20', folder: 'Documents' },
  { id: 'm3', fileName: 'chai_point_logo.png', fileType: 'LOGO', url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200', sizeKb: 120, uploadedAt: '2026-07-15', folder: 'Logos' },
  { id: 'm4', fileName: 'franchise_expo_promo.mp4', fileType: 'VIDEO', url: 'https://brizx.in/video/expo.mp4', sizeKb: 15400, uploadedAt: '2026-07-10', folder: 'Videos' },
];

const defaultSEO: SEOConfig = {
  metaTitle: 'BrizX India | #1 Verified Franchise Marketplace & Growth Accelerator',
  metaDescription: 'Discover and invest in 1,200+ verified franchise opportunities across India. Direct connection with brand owners, legal due diligence, and AI investor matching.',
  keywords: 'franchise in india, top franchises, QSR franchise, FOCO franchise, FOFO model, franchise opportunities, invest in franchise, verified franchise leads',
  canonicalUrl: 'https://brizx.in',
  ogImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
  twitterCard: 'summary_large_image',
  schemaMarkup: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "BrizX India",\n  "url": "https://brizx.in",\n  "logo": "https://brizx.in/logo.png"\n}',
  robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://brizx.in/sitemap.xml',
  sitemapXml: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://brizx.in/</loc><priority>1.0</priority></url>\n  <url><loc>https://brizx.in/search</loc><priority>0.9</priority></url>\n  <url><loc>https://brizx.in/pricing</loc><priority>0.8</priority></url>\n</urlset>',
  googleAnalyticsId: 'G-BRZX2026X9',
  googleSearchConsoleTag: 'gsc-verification-code-brizx-2026',
  facebookPixelId: '109283746592019'
};

const defaultContact: ContactConfig = {
  businessName: 'BrizX India Franchising Technologies Pvt Ltd',
  address: 'Level 8, UB City Tower, Vittal Mallya Road, Bengaluru, Karnataka 560001',
  phone: '+91 99795 10361',
  whatsapp: '+91 99795 10361',
  email: 'support@brizx.in',
  googleMapEmbedUrl: 'https://maps.google.com/maps?q=UB+City+Bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed',
  businessHours: 'Monday - Saturday: 9:00 AM - 7:00 PM IST',
  socialLinks: {
    facebook: 'https://facebook.com/brizxindia',
    instagram: 'https://instagram.com/brizxindia',
    linkedin: 'https://linkedin.com/company/brizxindia',
    youtube: 'https://youtube.com/@brizxindia',
    twitter: 'https://x.com/brizxindia'
  }
};

const defaultLeads: WebsiteLead[] = [
  { id: 'ld1', type: 'CONTACT', name: 'Rohan Mehta', email: 'rohan.m@gmail.com', phone: '+91 98200 11223', city: 'Mumbai', message: 'Looking for food franchise under 25 Lakhs in Thane.', status: 'NEW', createdAt: '2026-08-01' },
  { id: 'ld2', type: 'CONSULTATION', name: 'Siddharth Nair', email: 'sid.nair@techco.in', phone: '+91 97111 88990', city: 'Kochi', message: 'Interested in master franchise agreement for Kerala.', status: 'IN_PROGRESS', assignedStaff: 'Ankit Sharma', createdAt: '2026-07-29' }
];

const defaultAppearance: AppearanceConfig = {
  themeName: 'Enterprise Royal Blue',
  primaryColor: '#1e1b4b',
  secondaryColor: '#2563eb',
  accentColor: '#10b981',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
  faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  darkModeDefault: false
};

const defaultHeaderMenu: MenuItem[] = [
  { id: 'm_home', label: 'Home', url: '/', order: 1 },
  { id: 'm_brands', label: 'Explore Brands', url: '/search', order: 2 },
  { id: 'm_seekers', label: 'Find Seekers', url: '/seekers', order: 3 },
  { id: 'm_pricing', label: 'Pricing Plans', url: '/pricing', order: 4 },
  { id: 'm_about', label: 'About Us', url: '/about', order: 5 },
];

const defaultFooter: FooterConfig = {
  quickLinks: [
    { label: 'Browse Verified Brands', url: '/search' },
    { label: 'Franchise Seekers Directory', url: '/seekers' },
    { label: 'Brand Owner Pricing', url: '/pricing' },
    { label: 'ROI Calculator', url: '/seeker/roi-calculator' },
  ],
  serviceLinks: [
    { label: 'Franchise Advisory', url: '/services/brand-advisory' },
    { label: 'AI Smart Match', url: '/services/smart-match' },
    { label: 'Location GIS Catchment', url: '/services/location-due-diligence' },
  ],
  policyLinks: [
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Terms of Service', url: '/terms' },
    { label: 'FDD Compliance', url: '/fdd' },
    { label: 'Refund Policy', url: '/refund' },
  ],
  copyrightText: '© 2026 BrizX India Franchising Technologies Pvt Ltd. All rights reserved.',
  newsletterHeadline: 'Stay Ahead of High-ROI Franchise Launches',
  newsletterSubtext: 'Get weekly pre-launch alerts on vetted franchise opportunities before public listing.'
};

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hero, setHero] = useState<HeroSectionConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_hero`);
    return saved ? JSON.parse(saved) : defaultHero;
  });

  const [stats, setStats] = useState<StatItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_stats`);
    return saved ? JSON.parse(saved) : defaultStats;
  });

  const [trustedBrands, setTrustedBrands] = useState<TrustedBrandItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_trustedBrands`);
    return saved ? JSON.parse(saved) : defaultTrustedBrands;
  });

  const [homepageSections, setHomepageSections] = useState<HomepageSectionOrder[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_homepageSections`);
    return saved ? JSON.parse(saved) : defaultHomepageSections;
  });

  const [about, setAbout] = useState<AboutPageConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_about`);
    return saved ? JSON.parse(saved) : defaultAbout;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_services`);
    return saved ? JSON.parse(saved) : defaultServices;
  });

  const [blogs, setBlogs] = useState<BlogItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_blogs`);
    return saved ? JSON.parse(saved) : defaultBlogs;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_faqs`);
    return saved ? JSON.parse(saved) : defaultFaqs;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_testimonials`);
    return saved ? JSON.parse(saved) : defaultTestimonials;
  });

  const [pricingPlans, setPricingPlans] = useState<PricingPlanItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_pricingPlans`);
    return saved ? JSON.parse(saved) : defaultPricingPlans;
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_mediaFiles`);
    return saved ? JSON.parse(saved) : defaultMediaFiles;
  });

  const [seo, setSeo] = useState<SEOConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_seo`);
    return saved ? JSON.parse(saved) : defaultSEO;
  });

  const [contact, setContact] = useState<ContactConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_contact`);
    return saved ? JSON.parse(saved) : defaultContact;
  });

  const [leads, setLeads] = useState<WebsiteLead[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : defaultLeads;
  });

  const [appearance, setAppearance] = useState<AppearanceConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_appearance`);
    return saved ? JSON.parse(saved) : defaultAppearance;
  });

  const [headerMenu, setHeaderMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_headerMenu`);
    return saved ? JSON.parse(saved) : defaultHeaderMenu;
  });

  const [footer, setFooter] = useState<FooterConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_footer`);
    return saved ? JSON.parse(saved) : defaultFooter;
  });

  const [revisions, setRevisions] = useState<RevisionHistoryItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_revisions`);
    return saved ? JSON.parse(saved) : [
      { id: 'rev1', section: 'Hero Section', timestamp: new Date().toLocaleString(), modifiedBy: 'Super Admin', summary: 'Updated headline and sub-heading CTA links' },
      { id: 'rev2', section: 'Pricing Plans', timestamp: new Date(Date.now() - 3600000).toLocaleString(), modifiedBy: 'Super Admin', summary: 'Adjusted GST and annual discount coupons' }
    ];
  });

  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'SAVING' | 'UNSAVED'>('SAVED');

  const markUnsaved = () => {
    setSaveStatus('UNSAVED');
  };

  const addRevisionLog = (section: string, summary: string) => {
    const newLog: RevisionHistoryItem = {
      id: `rev_${Date.now()}`,
      section,
      timestamp: new Date().toLocaleString(),
      modifiedBy: 'Super Admin',
      summary
    };
    setRevisions(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const saveChanges = () => {
    setSaveStatus('SAVING');
    setTimeout(() => {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_hero`, JSON.stringify(hero));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_stats`, JSON.stringify(stats));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_trustedBrands`, JSON.stringify(trustedBrands));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_homepageSections`, JSON.stringify(homepageSections));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_about`, JSON.stringify(about));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_services`, JSON.stringify(services));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_blogs`, JSON.stringify(blogs));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_faqs`, JSON.stringify(faqs));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_testimonials`, JSON.stringify(testimonials));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_pricingPlans`, JSON.stringify(pricingPlans));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_mediaFiles`, JSON.stringify(mediaFiles));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_seo`, JSON.stringify(seo));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_contact`, JSON.stringify(contact));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_leads`, JSON.stringify(leads));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_appearance`, JSON.stringify(appearance));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_headerMenu`, JSON.stringify(headerMenu));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_footer`, JSON.stringify(footer));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_revisions`, JSON.stringify(revisions));

      setSaveStatus('SAVED');
    }, 400);
  };

  const resetAllToDefault = () => {
    setHero(defaultHero);
    setStats(defaultStats);
    setTrustedBrands(defaultTrustedBrands);
    setHomepageSections(defaultHomepageSections);
    setAbout(defaultAbout);
    setServices(defaultServices);
    setBlogs(defaultBlogs);
    setFaqs(defaultFaqs);
    setTestimonials(defaultTestimonials);
    setPricingPlans(defaultPricingPlans);
    setMediaFiles(defaultMediaFiles);
    setSeo(defaultSEO);
    setContact(defaultContact);
    setLeads(defaultLeads);
    setAppearance(defaultAppearance);
    setHeaderMenu(defaultHeaderMenu);
    setFooter(defaultFooter);

    localStorage.clear();
    setSaveStatus('SAVED');
    addRevisionLog('System Reset', 'Reset all CMS configurations to factory default');
  };

  return (
    <CMSContext.Provider value={{
      hero, setHero,
      stats, setStats,
      trustedBrands, setTrustedBrands,
      homepageSections, setHomepageSections,
      about, setAbout,
      services, setServices,
      blogs, setBlogs,
      faqs, setFaqs,
      testimonials, setTestimonials,
      pricingPlans, setPricingPlans,
      mediaFiles, setMediaFiles,
      seo, setSeo,
      contact, setContact,
      leads, setLeads,
      appearance, setAppearance,
      headerMenu, setHeaderMenu,
      footer, setFooter,
      revisions, addRevisionLog,
      resetAllToDefault,
      saveStatus, markUnsaved, saveChanges
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
