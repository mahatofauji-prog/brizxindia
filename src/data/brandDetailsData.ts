export interface EnrichedBrandData {
  heroImage: string;
  galleryImages: string[];
  about: {
    description: string;
    businessModel: string;
    keyAdvantages: string[];
    targetCustomers: string;
    whyInvest: string;
    expansionOpportunity: string;
    operationalModel: string;
  };
  investmentOverview: {
    investmentRequired: string;
    franchiseFee: string;
    royaltyFee: string;
    estimatedPayback: string;
    spaceRequired: string;
    expectedOutletCount: string;
    businessModelType: string;
    establishedYear: string;
    industry: string;
  };
  whyInvestCards: {
    title: string;
    description: string;
    iconName: string;
  }[];
}

export const brandDetailsMap: Record<string, EnrichedBrandData> = {
  // Burger Kingsway (b1 / burger-kingsway)
  b1: {
    heroImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'
    ],
    about: {
      description: 'Burger Kingsway is India\'s fastest growing gourmet QSR burger chain. Combining flame-grilled signature craft burgers, thick artisanal shakes, and cloud-kitchen optimized unit economics, Burger Kingsway has redefined quick-service dining across Tier 1 & Tier 2 Indian markets.',
      businessModel: 'Franchise Owned, Franchise Operated (FOFO) & FOCO Turnkey Models with 35% average gross margins.',
      keyAdvantages: [
        'Centralized frozen dough and patty supply chain ensures 0% local kitchen prep errors',
        'Direct Swiggy & Zomato priority POS integration yielding high online order velocity',
        'Automated digital conveyor fryers reducing kitchen labor footprint to just 3 staff',
        'Proven payback window of 12 to 18 months backed by audit reports'
      ],
      targetCustomers: 'Gen-Z students, tech professionals, foodies, and urban families seeking gourmet burgers at accessible price points.',
      whyInvest: 'QSR is India\'s fastest expanding F&B sector. Burger Kingsway provides an end-to-end turnkey store setup, complete staff training, and national brand marketing.',
      expansionOpportunity: 'High-priority franchise slots open across Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, and Chennai.',
      operationalModel: 'Standardized SOPs with automated kitchen equipment. All raw materials delivered bi-weekly from regional cold storage distribution hubs.'
    },
    investmentOverview: {
      investmentRequired: '₹15 - 30 Lakhs',
      franchiseFee: '₹5 Lakhs',
      royaltyFee: '4% Gross Sales',
      estimatedPayback: '12 - 18 Months',
      spaceRequired: '300 - 600 sq ft',
      expectedOutletCount: '120+ Active Outlets',
      businessModelType: 'FOFO / FOCO QSR Model',
      establishedYear: '2018',
      industry: 'Food & Beverages (QSR)'
    },
    whyInvestCards: [
      {
        title: 'Proven Unit Economics',
        description: 'Consistently delivers 30-35% operating margins across high footfall malls and high street locations.',
        iconName: 'TrendingUp'
      },
      {
        title: 'Turnkey Store Setup',
        description: 'Complete store layout design, kitchen machinery procurement, and launch support within 21 days.',
        iconName: 'Building2'
      },
      {
        title: 'Central Supply Network',
        description: 'Pre-portioned patties, craft buns, and signature sauces dispatched directly from central cold storage.',
        iconName: 'Truck'
      },
      {
        title: 'Digital Order Engine',
        description: 'Automated kiosk ordering and priority delivery aggregator integration for maximum online revenue.',
        iconName: 'Smartphone'
      },
      {
        title: 'Comprehensive Training',
        description: '14-day intensive training for franchise owners and kitchen staff at the Brand Academy.',
        iconName: 'GraduationCap'
      },
      {
        title: 'Territory Exclusivity',
        description: 'Exclusive catchments provided per outlet to ensure maximum customer density and zero brand cannibalization.',
        iconName: 'ShieldCheck'
      }
    ]
  },

  // Chai Point Express (b2 / chai-point-express)
  b2: {
    heroImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
    ],
    about: {
      description: 'Chai Point Express is India\'s favorite neighborhood and tech park chai kiosk brand. Famous for freshly brewed kulhad chai, crispy samosas, and regional snack delicacies served in hyper-clean, tech-enabled micro-cafes.',
      businessModel: 'Low Capex Kiosk & Express Outlet Model with Zero Royalty on gross revenue.',
      keyAdvantages: [
        'Zero Royalty model allowing franchise partners to retain maximum gross profits',
        'Compact footprint (150-300 sq ft) ideal for metro stations, tech parks, and hospital lobbies',
        'Smart automated tea brewing equipment guaranteeing consistent authentic flavor',
        'High daily transaction volume with fast customer turnaround times under 2 minutes'
      ],
      targetCustomers: 'Daily office commuters, tech workers, college students, and shoppers seeking hygienic freshly brewed tea and hot snacks.',
      whyInvest: 'Chai is India\'s most consumed daily beverage. Chai Point Express leverages high footfall micro-locations with minimal setup costs and quick payback.',
      expansionOpportunity: 'Prime transit locations and tech parks available in Bengaluru, Hyderabad, Delhi NCR, Kolkata, and Ahmedabad.',
      operationalModel: 'Simplified kitchen operation utilizing automated brewing dispensers and pre-packaged fresh bakery/snack supplies.'
    },
    investmentOverview: {
      investmentRequired: '₹8 - 18 Lakhs',
      franchiseFee: '₹3 Lakhs',
      royaltyFee: 'Zero Royalty (Flat Margin)',
      estimatedPayback: '9 - 14 Months',
      spaceRequired: '150 - 300 sq ft',
      expectedOutletCount: '240+ Active Outlets',
      businessModelType: 'FOFO Kiosk / Express Cafe',
      establishedYear: '2015',
      industry: 'Food & Beverages (Chai & Snacks)'
    },
    whyInvestCards: [
      {
        title: 'Zero Royalty Structure',
        description: 'Keep 100% of your operational profits with flat supply pricing on core ingredients.',
        iconName: 'IndianRupee'
      },
      {
        title: 'Micro Space Footprint',
        description: 'Operate profitably in spaces as compact as 150 sq ft in corporate parks and transit hubs.',
        iconName: 'MapPin'
      },
      {
        title: 'High Daily Footfall',
        description: 'Average 400+ daily orders per store driven by repeat office tea consumers.',
        iconName: 'Users'
      },
      {
        title: 'Smart Dispenser Tech',
        description: 'Iot-connected brewing systems that maintain exact water temperature and leaf infusion timing.',
        iconName: 'Cpu'
      },
      {
        title: 'Rapid 9-Month Payback',
        description: 'One of the fastest capital recovery ratios in the Indian beverage sector.',
        iconName: 'Clock'
      },
      {
        title: 'Turnkey Supply Chain',
        description: 'Daily fresh milk, kulhad clay cups, and oven-baked snacks delivered directly to your doorstep.',
        iconName: 'Truck'
      }
    ]
  },

  // Apollo HealthHub Diagnostics (b3 / apollo-healthhub-diagnostics)
  b3: {
    heroImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    ],
    about: {
      description: 'Apollo HealthHub Diagnostics brings world-class medical testing, pathology, digital health checkups, and doctor consultation pods to neighborhood residential hubs across India.',
      businessModel: 'Hub-and-Spoke Medical Collection & Diagnostic Center with high margins.',
      keyAdvantages: [
        'Trusted healthcare brand with immediate patient credibility and doctor referrals',
        'NABL-accredited central reference laboratories ensuring 100% test precision',
        'Comprehensive digital health suite with automatic report delivery via WhatsApp and Mobile App',
        'High average order value with corporate bulk checkup and home sample collection services'
      ],
      targetCustomers: 'Families, senior citizens, chronic care patients, corporate wellness accounts, and local medical practitioners.',
      whyInvest: 'Healthcare diagnostics is a recession-proof, high-yield industry with non-cyclical demand and expanding preventative health awareness in India.',
      expansionOpportunity: 'Exclusive center allocations available in Mumbai, Delhi NCR, Pune, Jaipur, Lucknow, and Indore.',
      operationalModel: 'Sample collection performed locally by trained phlebotomists and routed to NABL central labs with automated cloud reporting.'
    },
    investmentOverview: {
      investmentRequired: '₹35 - 65 Lakhs',
      franchiseFee: '₹8 Lakhs',
      royaltyFee: '5% Monthly Revenue',
      estimatedPayback: '18 - 24 Months',
      spaceRequired: '800 - 1200 sq ft',
      expectedOutletCount: '85+ Active Hubs',
      businessModelType: 'FOCO / FOFO Health Hub',
      establishedYear: '2017',
      industry: 'Healthcare & Diagnostics'
    },
    whyInvestCards: [
      {
        title: 'Recession-Proof Industry',
        description: 'Essential diagnostic demand remains steady across all economic cycles.',
        iconName: 'ShieldCheck'
      },
      {
        title: 'NABL Accredited Labs',
        description: 'All samples processed at central reference labs with top medical certifications.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Home Sample Collection',
        description: 'Expand your market reach through mobile phlebotomist booking apps.',
        iconName: 'Home'
      },
      {
        title: 'Doctor Referral Network',
        description: 'Gain immediate medical trust and doctor partnerships upon center opening.',
        iconName: 'Stethoscope'
      },
      {
        title: 'Digital Health App',
        description: 'Automated digital reports sent directly to patients with doctor consultation links.',
        iconName: 'Smartphone'
      },
      {
        title: 'High Customer Lifetime Value',
        description: 'Repeat annual health packages generate predictable recurring cashflows.',
        iconName: 'Repeat'
      }
    ]
  },

  // Fitlab Arena Studios (b4 / fitlab-arena-studios)
  b4: {
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80'
    ],
    about: {
      description: 'FitLab Arena Studios is a revolutionary 24/7 keycard-access boutique gym chain equipped with smart cardio machines, AI form-check screens, automated attendance, and functional HIIT zones.',
      businessModel: 'Low-Labor Tech-Automated Fitness Studio with high monthly subscription retention.',
      keyAdvantages: [
        '24/7 keycard automated entry allowing round-the-clock member access with low staffing',
        'Recurring monthly auto-debit membership model ensuring reliable upfront cashflow',
        'Premium commercial equipment vendor tie-ups with deferred equipment leasing options',
        'Strong community retention programs yielding an average 78% annual renewal rate'
      ],
      targetCustomers: 'Urban working professionals, fitness enthusiasts, executives, and neighborhood residents.',
      whyInvest: 'Combines the boom in urban wellness with smart automation, minimizing payroll costs while delivering high monthly recurring revenues.',
      expansionOpportunity: 'Unlocking premium residential catchments in Bengaluru, Mumbai, Pune, Gurgaon, and Hyderabad.',
      operationalModel: 'Automated member check-in via mobile app/keycard, managed by 1-2 studio managers and certified personal trainers.'
    },
    investmentOverview: {
      investmentRequired: '₹25 - 45 Lakhs',
      franchiseFee: '₹6 Lakhs',
      royaltyFee: '6% Monthly Revenue',
      estimatedPayback: '14 - 20 Months',
      spaceRequired: '1200 - 2500 sq ft',
      expectedOutletCount: '42+ Active Studios',
      businessModelType: 'Automated Boutique Gym',
      establishedYear: '2020',
      industry: 'Fitness & Wellness'
    },
    whyInvestCards: [
      {
        title: '24/7 Keycard Automation',
        description: 'Operate effortlessly around the clock with low staff supervision requirements.',
        iconName: 'Lock'
      },
      {
        title: 'Recurring Monthly Revenue',
        description: 'Predictable cash flow driven by auto-debit monthly membership subscriptions.',
        iconName: 'CreditCard'
      },
      {
        title: 'AI Workout Kiosks',
        description: 'Interactive virtual trainer screens offering posture checks and custom workouts.',
        iconName: 'Cpu'
      },
      {
        title: 'Equipment Lease Tie-Ups',
        description: 'Lower upfront Capex through brand-negotiated commercial equipment leasing.',
        iconName: 'Dumbbell'
      },
      {
        title: 'High Member Retention',
        description: 'Integrated mobile app gamification keeps members engaged and renewing.',
        iconName: 'Heart'
      },
      {
        title: 'Turnkey Architectural Design',
        description: 'Acoustic wall paneling, LED lighting schemes, and lockers installed by brand team.',
        iconName: 'Layout'
      }
    ]
  },

  // EV ChargeGrid Hubs (b5 / ev-chargegrid-hubs)
  b5: {
    heroImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558441719-23451ead6699?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80'
    ],
    about: {
      description: 'EV ChargeGrid Hubs is India\'s premier high-speed EV hyper-charging network. Operating dual DC 120kW chargers integrated with solar canopy roofs, lounge seating, and roadside convenience retail.',
      businessModel: 'Energy Margin + Retail Convenience Shared Revenue Model.',
      keyAdvantages: [
        'Dual revenue stream from electric charging margins and attached convenience store sales',
        'Strategic partnership with highway concessionaires and urban commercial complexes',
        'Automated cloud CMS managing dynamic charging tariffs, load balancing, and instant payments',
        'Backed by Government of India green energy incentives and mandatory EV charging policies'
      ],
      targetCustomers: 'Electric car owners, commercial taxi fleets, EV logistics vehicles, and highway travelers.',
      whyInvest: 'Capitalize on India\'s massive transition to electric mobility with passive infrastructure returns and long-term land utilization.',
      expansionOpportunity: 'Prime highway corridors and urban hubs available across Pan-India highways, Bengaluru, Delhi NCR, and Chandigarh.',
      operationalModel: 'Fully automated charging bays with 24/7 CCTV remote monitoring and zero day-to-day manual intervention required.'
    },
    investmentOverview: {
      investmentRequired: '₹20 - 40 Lakhs',
      franchiseFee: '₹4 Lakhs',
      royaltyFee: '3% Energy Sale Margin',
      estimatedPayback: '12 - 16 Months',
      spaceRequired: '500 - 1000 sq ft',
      expectedOutletCount: '180+ Active Hubs',
      businessModelType: 'EV Charging + Retail Hub',
      establishedYear: '2021',
      industry: 'Automobile & EV Infrastructure'
    },
    whyInvestCards: [
      {
        title: 'Future-Proof Sector',
        description: 'Benefit directly from India\'s rapid electric vehicle adoption mandate.',
        iconName: 'Zap'
      },
      {
        title: 'Passive Income Stream',
        description: 'Automated charging bays generate revenue 24/7 with minimal staffing.',
        iconName: 'DollarSign'
      },
      {
        title: 'Highway & Urban Land Use',
        description: 'Monetize vacant commercial plots or highway roadside property efficiently.',
        iconName: 'Map'
      },
      {
        title: 'Solar Power Integration',
        description: 'Reduce grid electricity costs by generating solar power through canopy panels.',
        iconName: 'Sun'
      },
      {
        title: 'Fleet Operator Contracts',
        description: 'Guaranteed minimum monthly charging volumes from commercial EV fleet partners.',
        iconName: 'Truck'
      },
      {
        title: 'Remote Maintenance Support',
        description: '24/7 hardware monitoring and rapid field response teams provided nationwide.',
        iconName: 'Wrench'
      }
    ]
  },

  // Kidzee Genius Academy (b6 / kidzee-genius-academy)
  b6: {
    heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
    ],
    about: {
      description: 'Kidzee Genius Academy is an award-winning preschool and daycare franchise network blending STEAM curriculum, sensory play, robotics, and bilingual communication for early childhood development.',
      businessModel: 'Annual Tuition & Activity Fee Model with high community trust.',
      keyAdvantages: [
        '92% annual student retention and high word-of-mouth referral rate among urban parents',
        'Proprietary STEAM curriculum, activity workbooks, and teacher training certifications provided',
        'High upfront annual tuition cashflow securing working capital for the franchise owner',
        'Comprehensive marketing support including local parent workshops and digital ad campaigns'
      ],
      targetCustomers: 'Young urban parents seeking premium preschool education and safe daycare environments for ages 1.5 to 6 years.',
      whyInvest: 'Education is India\'s most prized family investment. Kidzee provides a respected, fulfilling business with stable long-term yields.',
      expansionOpportunity: 'Exclusive residential township territories available in Delhi NCR, Jaipur, Ahmedabad, Surat, and Kolkata.',
      operationalModel: 'Child-friendly campus layout with certified teachers trained and audited quarterly by Kidzee Academic Directors.'
    },
    investmentOverview: {
      investmentRequired: '₹12 - 25 Lakhs',
      franchiseFee: '₹4 Lakhs',
      royaltyFee: '8% Annual Tuition Fee',
      estimatedPayback: '15 - 22 Months',
      spaceRequired: '1500 - 3000 sq ft',
      expectedOutletCount: '310+ Active Academies',
      businessModelType: 'STEAM Preschool & Daycare',
      establishedYear: '2012',
      industry: 'Education & Early Learning'
    },
    whyInvestCards: [
      {
        title: 'Trusted Educational Brand',
        description: 'Over 12 years of excellence in early childhood STEAM education across India.',
        iconName: 'Award'
      },
      {
        title: '92% Retention Rate',
        description: 'Consistent multi-year student enrollments from playgroup to kindergarten.',
        iconName: 'UserCheck'
      },
      {
        title: 'Upfront Annual Cashflow',
        description: 'Parents pay tuition term fees upfront, providing strong working capital.',
        iconName: 'DollarSign'
      },
      {
        title: 'Teacher Recruitment Support',
        description: 'Kidzee HR team helps screen, hire, and certify qualified preschool teachers.',
        iconName: 'Users'
      },
      {
        title: 'Child Safety Protocols',
        description: 'Complete CCTV parent app streaming, rubberized floor mats, and fire safety systems.',
        iconName: 'Shield'
      },
      {
        title: 'High Social Impact',
        description: 'Build a respected educational institution in your local community.',
        iconName: 'Heart'
      }
    ]
  },

  // AIT World Automation (b7 / ait-world-automation)
  b7: {
    heroImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    about: {
      description: 'AIT World Automation is India\'s pioneer in IoT smart building automation, retrofit home controls, smart lighting, automated security, and industrial IoT solutions.',
      businessModel: 'Hardware Distribution + Installation Margin with Zero Royalty.',
      keyAdvantages: [
        'Zero Royalty model with high margins on smart touch panels, Wi-Fi relays, and smart locks',
        'Retrofit hardware technology requiring zero physical rewiring or wall destruction during installation',
        'B2B builder and architect channel partnerships provided to franchise owners',
        'Dedicated mobile app controlling lighting, climate, security, and voice integration (Alexa/Google)'
      ],
      targetCustomers: 'Homeowners, interior designers, architects, luxury villa owners, hotel managers, and real estate developers.',
      whyInvest: 'Smart home adoption in India is growing at 28% CAGR. AIT provides a tech-forward franchise with zero ongoing royalty fees.',
      expansionOpportunity: 'Experience center opportunities available in Ahmedabad, Mumbai, Bengaluru, Delhi NCR, and Tier 2 growth hubs.',
      operationalModel: 'Experience showroom featuring live smart home mockups and local technical installation teams trained by AIT engineers.'
    },
    investmentOverview: {
      investmentRequired: '₹20 - 25 Lakhs',
      franchiseFee: '₹5 Lakhs',
      royaltyFee: 'Flat Supply Margin / Zero Royalty',
      estimatedPayback: '12 - 18 Months',
      spaceRequired: '250 - 500 sq ft',
      expectedOutletCount: '38+ Experience Centers',
      businessModelType: 'IoT Showroom & Installation Hub',
      establishedYear: '2012',
      industry: 'Home & Building Automation'
    },
    whyInvestCards: [
      {
        title: 'Zero Royalty Advantage',
        description: 'Keep all profits from hardware sales and installation labor fees.',
        iconName: 'IndianRupee'
      },
      {
        title: 'Retrofit Wireless Tech',
        description: 'No rewiring needed — installs into existing switchboards in under 2 hours.',
        iconName: 'Wifi'
      },
      {
        title: 'Architect Channel Leads',
        description: 'Get direct B2B project leads from local interior designer and architect networks.',
        iconName: 'Briefcase'
      },
      {
        title: 'Full Hardware Warranty',
        description: '3-year replacement warranty backed directly by AIT manufacturing labs.',
        iconName: 'ShieldCheck'
      },
      {
        title: 'Turnkey Showroom Setup',
        description: 'Complete interactive demo wall setup provided with voice assistant integration.',
        iconName: 'Monitor'
      },
      {
        title: 'Engineer Technical Training',
        description: 'Hands-on training for your local electrician and support team at AIT Head Office.',
        iconName: 'Cpu'
      }
    ]
  }
};

/**
 * Intelligent Fallback Generator for any custom or new brand added to the database
 */
export function getEnrichedBrandData(brand: any): EnrichedBrandData {
  if (!brand) return brandDetailsMap['b1'];

  const brandId = String(brand.id || '');
  if (brandDetailsMap[brandId]) {
    return brandDetailsMap[brandId];
  }

  // Also check by slugified brand name
  const nameSlug = (brand.brandName || '').toLowerCase().replace(/[^a-z0-0]+/g, '-');
  for (const [id, data] of Object.entries(brandDetailsMap)) {
    if (brandId.toLowerCase().includes(id.toLowerCase())) {
      return data;
    }
  }

  const industry = (brand.industry || '').toUpperCase();
  const name = brand.brandName || 'Franchise Partner';

  let heroImage = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80';
  let galleryImages = [
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
  ];

  if (industry.includes('FOOD') || industry.includes('BEVERAGE') || industry.includes('RESTAURANT')) {
    heroImage = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';
    galleryImages = [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'
    ];
  } else if (industry.includes('HEALTH') || industry.includes('DIAGNOSTIC') || industry.includes('MEDICAL')) {
    heroImage = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80';
    galleryImages = [
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    ];
  } else if (industry.includes('FITNESS') || industry.includes('GYM') || industry.includes('WELLNESS')) {
    heroImage = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80';
    galleryImages = [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80'
    ];
  } else if (industry.includes('EDUCAT') || industry.includes('SCHOOL') || industry.includes('ACADEMY')) {
    heroImage = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80';
    galleryImages = [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
    ];
  } else if (industry.includes('EV') || industry.includes('AUTO') || industry.includes('ENERGY')) {
    heroImage = 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80';
    galleryImages = [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558441719-23451ead6699?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80'
    ];
  }

  const minInv = brand.investmentRequired?.min || brand.minInvestment || 15;
  const maxInv = brand.investmentRequired?.max || brand.maxInvestment || 30;

  return {
    heroImage,
    galleryImages,
    about: {
      description: brand.description || `${name} is a premier brand in the ${brand.industry || 'Retail'} industry offering franchise expansion across India.`,
      businessModel: 'Franchise Owned, Franchise Operated (FOFO) & Turnkey Operations.',
      keyAdvantages: [
        'Strong brand recognition and established customer base',
        'Turnkey setup assistance including location selection and store layout',
        'Comprehensive staff training and operational SOP manuals',
        'Centralized supply chain and marketing campaign support'
      ],
      targetCustomers: 'Retail customers, families, professionals, and local community members.',
      whyInvest: `${name} offers a high return on investment with proven unit economics and end-to-end support.`,
      expansionOpportunity: `Priority franchise expansion available across Tier 1 & Tier 2 cities in India.`,
      operationalModel: 'Standardized operational procedures supported by brand regional managers.'
    },
    investmentOverview: {
      investmentRequired: `₹${minInv} - ${maxInv} Lakhs`,
      franchiseFee: brand.franchiseFee ? `₹${brand.franchiseFee} Lakhs` : '₹5 Lakhs',
      royaltyFee: brand.royaltyFee || '5% Gross Sales',
      estimatedPayback: brand.roiPayback || brand.paybackPeriod || '12 - 18 Months',
      spaceRequired: brand.spaceRequired || '500 - 1000 sq ft',
      expectedOutletCount: brand.totalOutlets ? `${brand.totalOutlets}+ Active Outlets` : '50+ Active Outlets',
      businessModelType: 'FOFO / FOCO Model',
      establishedYear: brand.establishedYear ? String(brand.establishedYear) : '2018',
      industry: brand.industry || 'Multi-Sector'
    },
    whyInvestCards: [
      {
        title: 'Proven Unit Economics',
        description: 'Consistently strong operating margins supported by brand SOPs.',
        iconName: 'TrendingUp'
      },
      {
        title: 'Turnkey Store Setup',
        description: 'Complete store setup, interior design, and grand launch assistance.',
        iconName: 'Building2'
      },
      {
        title: 'Central Supply Network',
        description: 'Reliable raw material sourcing and inventory management systems.',
        iconName: 'Truck'
      },
      {
        title: 'Marketing & Digital Ads',
        description: 'National and regional marketing campaigns to drive initial store footfalls.',
        iconName: 'Sparkles'
      },
      {
        title: 'Full Operational Support',
        description: 'Dedicated regional manager support and staff training programs.',
        iconName: 'Users'
      },
      {
        title: 'Territory Protection',
        description: 'Protected catchment zone ensuring exclusive local market operation.',
        iconName: 'ShieldCheck'
      }
    ]
  };
}
