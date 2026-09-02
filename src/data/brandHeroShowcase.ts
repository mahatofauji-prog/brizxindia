import heroBrand01 from '../assets/images/hero_brand_01_1788233769916.jpg';
import heroBrand02 from '../assets/images/hero_brand_02_1788233783318.jpg';
import heroBrand03 from '../assets/images/hero_brand_03_1788233796633.jpg';
import heroBrand04 from '../assets/images/hero_brand_04_1788233808124.jpg';
import heroBrand05 from '../assets/images/hero_brand_05_1788233821836.jpg';
import heroBrand06 from '../assets/images/hero_brand_06_1788233834696.jpg';
import heroBrand07 from '../assets/images/hero_brand_07_1788233848560.jpg';
import heroBrand08 from '../assets/images/hero_brand_08_1788233862337.jpg';
import heroBrand09 from '../assets/images/hero_brand_09_1788233876512.jpg';
import heroBrand10 from '../assets/images/hero_brand_10_1788233888481.jpg';

export interface BrandShowcaseSlide {
  id: string;
  brandName: string;
  category: string;
  tagline: string;
  investmentRange: string;
  expansionModel: string;
  outletsCount: string;
  characterTitle: string;
  image: string;
  accentColor: string;
  badge: string;
}

export const DEFAULT_BRAND_HERO_SLIDES: BrandShowcaseSlide[] = [
  {
    id: 'slide-fb',
    brandName: 'Chai Point Express',
    category: 'Food & Beverage Franchise',
    tagline: "India's Leading Freshly Brewed Chai & Fast-Casual Café Network",
    investmentRange: '₹15L – ₹25L',
    expansionModel: 'FOFO / FOCO Model',
    outletsCount: '240+ Outlets',
    characterTitle: 'Vikram Malhotra • Master Franchise Director',
    image: heroBrand01,
    accentColor: 'from-amber-500/30 to-blue-600/30',
    badge: 'QSR & BEVERAGES'
  },
  {
    id: 'slide-fitness',
    brandName: 'FitLab Pro Athletics',
    category: 'Fitness & Sports Franchise',
    tagline: 'Next-Gen Smart Gyms with Connected IoT Equipment & Recovery Hubs',
    investmentRange: '₹45L – ₹80L',
    expansionModel: 'FOFO Multi-Unit Model',
    outletsCount: '85+ Clubs Nationwide',
    characterTitle: 'Ananya Sharma • Managing Partner & Head Coach',
    image: heroBrand02,
    accentColor: 'from-blue-600/30 to-indigo-600/30',
    badge: 'FITNESS & HEALTH'
  },
  {
    id: 'slide-fashion',
    brandName: 'Urban Heritage India',
    category: 'Fashion & Apparel Franchise',
    tagline: 'Contemporary Ethnic & Sustainable Designer Apparel Boutiques',
    investmentRange: '₹35L – ₹65L',
    expansionModel: 'High-Street FOFO',
    outletsCount: '120+ Boutiques',
    characterTitle: 'Rohan Singhania • Chief Brand Strategist',
    image: heroBrand03,
    accentColor: 'from-rose-500/30 to-indigo-600/30',
    badge: 'FASHION & LIFESTYLE'
  },
  {
    id: 'slide-wellness',
    brandName: 'Kaya Aesthetics & Medi-Spa',
    category: 'Beauty & Wellness Franchise',
    tagline: 'Advanced Clinical Dermatology, Laser Aesthetics & Holistic Wellness',
    investmentRange: '₹30L – ₹55L',
    expansionModel: 'Turnkey FOCO Clinic',
    outletsCount: '95+ Aesthetic Clinics',
    characterTitle: 'Dr. Meera Nambiar • Clinical Director & Partner',
    image: heroBrand04,
    accentColor: 'from-emerald-500/30 to-blue-600/30',
    badge: 'BEAUTY & DERMA'
  },
  {
    id: 'slide-education',
    brandName: 'EuroKids STEM Academy',
    category: 'Education & EdTech Franchise',
    tagline: 'Experiential Early Childhood Development & Tech-Enabled Preschools',
    investmentRange: '₹18L – ₹32L',
    expansionModel: 'Exclusive Territory FOFO',
    outletsCount: '310+ Centers in India',
    characterTitle: 'Rajeshwar Rao • Regional Education Director',
    image: heroBrand05,
    accentColor: 'from-sky-500/30 to-indigo-600/30',
    badge: 'EDTECH & PRESCHOOL'
  },
  {
    id: 'slide-retail',
    brandName: 'VisionCraft Omni-Retail',
    category: 'Retail & Eyewear Franchise',
    tagline: 'AI-Powered Smart Optical Stores & High-Volume Footfall Centers',
    investmentRange: '₹25L – ₹40L',
    expansionModel: 'Zero-Inventory Model',
    outletsCount: '180+ Smart Stores',
    characterTitle: 'Kavita Deshmukh • National Retail Head',
    image: heroBrand06,
    accentColor: 'from-cyan-500/30 to-blue-700/30',
    badge: 'OMNI-RETAIL'
  },
  {
    id: 'slide-cafe',
    brandName: 'Blue Tokai Roastery Lounge',
    category: 'Specialty Café Franchise',
    tagline: 'Artisanal Single-Origin Arabica Roasteries & Modern Social Lounges',
    investmentRange: '₹22L – ₹38L',
    expansionModel: 'Kiosk & Café Hybrid',
    outletsCount: '65+ Signature Lounges',
    characterTitle: 'Arjun Mehta • VP Franchise Expansion',
    image: heroBrand07,
    accentColor: 'from-amber-600/30 to-blue-600/30',
    badge: 'SPECIALTY CAFÉ'
  },
  {
    id: 'slide-qsr',
    brandName: 'Kingsway Gourmet Burgers',
    category: 'QSR (Quick Service) Franchise',
    tagline: "India's Fastest Growing High-Margin Gourmet Quick-Serve Food Chain",
    investmentRange: '₹12L – ₹22L',
    expansionModel: 'Drive-Thru & Mall Express',
    outletsCount: '140+ Outlets',
    characterTitle: 'Simran Kaur • Head of QSR Operations',
    image: heroBrand08,
    accentColor: 'from-orange-500/30 to-red-600/30',
    badge: 'QSR FAST FOOD'
  },
  {
    id: 'slide-service',
    brandName: 'VoltCharge & Mobility Care',
    category: 'Service & Clean-Tech Franchise',
    tagline: 'Automated Ultra-Fast EV Charging Stations & Fleet Care Superhubs',
    investmentRange: '₹20L – ₹45L',
    expansionModel: 'Landlord FOCO Revenue-Share',
    outletsCount: '75+ Strategic Hubs',
    characterTitle: 'Devendra Patel • Managing Director',
    image: heroBrand09,
    accentColor: 'from-teal-500/30 to-blue-600/30',
    badge: 'EV & MOBILITY'
  },
  {
    id: 'slide-lifestyle',
    brandName: 'ZenSpace Corporate Suites',
    category: 'Lifestyle & Co-Working Franchise',
    tagline: 'Enterprise Hybrid Workspaces, Executive Lounges & Creator Studios',
    investmentRange: '₹60L – ₹1.2Cr',
    expansionModel: 'Premium Commercial FOCO',
    outletsCount: '42+ Corporate Centers',
    characterTitle: 'Pooja Hegde • Executive Operations Director',
    image: heroBrand10,
    accentColor: 'from-purple-500/30 to-blue-600/30',
    badge: 'CO-WORKING & SUITES'
  }
];
