import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { getEnrichedBrandData } from '../../data/brandDetailsData';
import { BrandLogo } from '../../components/BrandLogo';
import { 
  ShieldCheck, MapPin, Briefcase, IndianRupee, Clock, ArrowLeft,
  ChevronRight, Building2, CheckCircle2, Award, Users, TrendingUp,
  Sparkles, Truck, Smartphone, Cpu, Lock, Heart, DollarSign,
  Send, AlertCircle, CheckCircle, RefreshCw, Layout, Layers
, Phone, Mail, Globe } from 'lucide-react';

export default function BrandDetails() {
  const { brandId, id } = useParams<{ brandId?: string; id?: string }>();
  const targetId = brandId || id || '';
  const { brands, addApplication } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { smartMatchScore, matchBreakdown } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if we should scroll to the application form
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('apply') === 'true') {
      setTimeout(() => {
        const formElement = document.getElementById('application-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [targetId, location.search]);

  // Find exact brand by ID or slug
  const brand = brands.find(b => {
    const bId = String(b.id || '');
    const bNameSlug = (b.brandName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return bId.toLowerCase() === targetId.toLowerCase() || bNameSlug === targetId.toLowerCase();
  });

  const enrichedData = getEnrichedBrandData(brand);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    applicantName: '',
    mobile: '',
    email: '',
    whatsApp: '',
    city: '',
    state: '',
    investmentBudget: '',
    availableCapital: '',
    preferredLocation: '',
    occupation: '',
    businessExperience: '',
    franchiseType: 'FOFO',
    message: '',
    agreeTerms: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Data variables using brand fields if available, otherwise fallback
  const heroImg = brand.coverImage || getEnrichedBrandData(brand).heroImage;
  const galleryImgs = brand.galleryImages?.length ? brand.galleryImages : getEnrichedBrandData(brand).galleryImages;
  
  const aboutDescription = brand.fullAbout || brand.description || getEnrichedBrandData(brand).about.description;
  const businessModel = brand.businessModel || getEnrichedBrandData(brand).about.businessModel;
  const operationalModel = getEnrichedBrandData(brand).about.operationalModel;
  const keyAdvantages = brand.keyAdvantages?.length ? brand.keyAdvantages : getEnrichedBrandData(brand).about.keyAdvantages;
  const targetCustomers = brand.targetCustomer || getEnrichedBrandData(brand).about.targetCustomers;
  const expansionOpp = brand.expansionOpportunity || getEnrichedBrandData(brand).about.expansionOpportunity;
  
  const minInv = brand.investmentRequired?.min || brand.minInvestment;
  const maxInv = brand.investmentRequired?.max || brand.maxInvestment;
  const investmentRequiredStr = minInv && maxInv ? `₹${minInv} - ${maxInv} Lakhs` : getEnrichedBrandData(brand).investmentOverview.investmentRequired;
  
  const franchiseFeeStr = brand.franchiseFee ? `₹${brand.franchiseFee} Lakhs` : getEnrichedBrandData(brand).investmentOverview.franchiseFee;
  const royaltyFeeStr = brand.royaltyFee || brand.royalty || getEnrichedBrandData(brand).investmentOverview.royaltyFee;
  const estimatedPaybackStr = brand.paybackPeriod || brand.roiPayback || getEnrichedBrandData(brand).investmentOverview.estimatedPayback;
  const spaceRequiredStr = brand.spaceRequired || getEnrichedBrandData(brand).investmentOverview.spaceRequired;
  const expectedOutletCountStr = brand.totalOutlets || brand.outlets ? `${brand.totalOutlets || brand.outlets}+ Active Outlets` : getEnrichedBrandData(brand).investmentOverview.expectedOutletCount;
  const businessModelTypeStr = brand.businessModel || getEnrichedBrandData(brand).investmentOverview.businessModelType;
  const establishedYearStr = brand.establishedYear || brand.established ? String(brand.establishedYear || brand.established) : getEnrichedBrandData(brand).investmentOverview.establishedYear;
  const industryStr = brand.industry || getEnrichedBrandData(brand).investmentOverview.industry;
  useEffect(() => {
    if (enrichedData && enrichedData.investmentOverview) {
      setFormData(prev => ({
        ...prev,
        investmentBudget: prev.investmentBudget || investmentRequiredStr
      }));
    }
  }, [brand]);

  if (!brand) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 p-6">
        <Building2 size={56} className="text-blue-600 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-slate-900">Brand Profile Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 text-center max-w-md">
          No active franchise listing exists matching ID or handle "{targetId}".
        </p>
        <Link 
          to="/brands" 
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-blue-200 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Browse All Verified Brands
        </Link>
      </main>
    );
  }

  const brandName = brand.brandName || 'Franchise Partner';

  // Form input validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.applicantName.trim()) {
      errors.applicantName = 'Full name is required';
    }
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^[0-9+\s-]{10,14}$/.test(formData.mobile.replace(/\s+/g, ''))) {
      errors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    if (!formData.investmentBudget.trim()) {
      errors.investmentBudget = 'Investment budget is required';
    }
    if (!formData.preferredLocation.trim()) {
      errors.preferredLocation = 'Preferred location is required';
    }
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to be contacted for this opportunity';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addApplication({
        brandId: String(brand.id),
        brandName: brandName,
        seekerId: user?.id,
        applicantName: formData.applicantName,
        mobile: formData.mobile,
        email: formData.email,
        whatsApp: formData.whatsApp || formData.mobile,
        city: formData.city,
        state: formData.state,
        investmentBudget: formData.investmentBudget,
        availableCapital: formData.availableCapital,
        preferredLocation: formData.preferredLocation,
        occupation: formData.occupation,
        businessExperience: formData.businessExperience,
        franchiseType: formData.franchiseType,
        message: formData.message,
        assignedBrandOwnerId: String(brand.id),
        smartMatchScore: smartMatchScore,
        matchBreakdown: matchBreakdown
      });

      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
    }, 600);
  };

  // Helper icon mapper for benefit cards
  const renderIcon = (name: string) => {
    switch (name) {
      case 'TrendingUp': return <TrendingUp className="text-blue-600" size={22} />;
      case 'Building2': return <Building2 className="text-blue-600" size={22} />;
      case 'Truck': return <Truck className="text-blue-600" size={22} />;
      case 'Smartphone': return <Smartphone className="text-blue-600" size={22} />;
      case 'GraduationCap': return <Award className="text-blue-600" size={22} />;
      case 'ShieldCheck': return <ShieldCheck className="text-blue-600" size={22} />;
      case 'IndianRupee': return <IndianRupee className="text-blue-600" size={22} />;
      case 'MapPin': return <MapPin className="text-blue-600" size={22} />;
      case 'Users': return <Users className="text-blue-600" size={22} />;
      case 'Cpu': return <Cpu className="text-blue-600" size={22} />;
      case 'Clock': return <Clock className="text-blue-600" size={22} />;
      case 'Lock': return <Lock className="text-blue-600" size={22} />;
      case 'CreditCard': return <DollarSign className="text-blue-600" size={22} />;
      case 'Zap': return <Sparkles className="text-blue-600" size={22} />;
      default: return <Sparkles className="text-blue-600" size={22} />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* BREADCRUMB HEADER */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <button 
            onClick={() => {
              if (user?.role === 'FRANCHISE_SEEKER') {
                const fromPath = location.state?.from;
                if (fromPath && fromPath.startsWith('/seeker')) {
                  navigate(fromPath);
                } else if (window.history.state && window.history.state.idx > 0) {
                  navigate(-1);
                } else {
                  navigate('/seeker/browse-brands');
                }
              } else {
                navigate('/brands');
              }
            }}
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors font-bold cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            {user?.role === 'FRANCHISE_SEEKER' ? (
              <>
                <Link to="/seeker" className="hover:text-slate-900">Seeker Portal</Link>
                <ChevronRight size={12} />
                <Link to="/seeker/browse-brands" className="hover:text-slate-900">Browse Brands</Link>
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-slate-900">BrizX</Link>
                <ChevronRight size={12} />
                <Link to="/brands" className="hover:text-slate-900">Brands</Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-blue-700 font-extrabold">{brandName}</span>
          </div>
        </div>
      </div>

      {/* BRAND HERO SECTION (LIGHT SOFT BLUE GRADIENT THEME) */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/80 py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-blue-100/80 text-blue-800 border border-blue-200 text-[11px] font-black uppercase px-3 py-1 rounded-full">
                  {brand.industry}
                </span>
                {brand.verified && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-600" /> BrizX Verified
                  </span>
                )}
                {brand.badge && (
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-black uppercase px-3 py-1 rounded-full">
                    {brand.badge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <BrandLogo
                  logo={brand.logo}
                  brandName={brandName}
                  industry={brand.industry}
                  verified={brand.verified}
                  size="xl"
                  className="ring-4 ring-white shadow-lg"
                />
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
                    {brandName}
                  </h1>
                  <p className="text-blue-800 font-bold text-sm sm:text-base mt-1">
                    {brand.tagline || aboutDescription.slice(0, 80)}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl font-normal">
                {brand.description || aboutDescription}
              </p>

              {/* Highlight Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Investment</span>
                  <span className="text-sm font-black text-blue-700 mt-0.5 block">
                    {investmentRequiredStr}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Franchise Fee</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">
                    {franchiseFeeStr}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Est. Payback</span>
                  <span className="text-sm font-black text-emerald-700 mt-0.5 block">
                    {estimatedPaybackStr}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Outlets</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">
                    {expectedOutletCountStr}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#application-form"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-md shadow-blue-200 cursor-pointer"
                >
                  Apply For Franchise <ChevronRight size={16} />
                </a>
              </div>

            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-white group">
                <img 
                  src={galleryImgs[selectedImageIndex] || heroImg} 
                  alt={brandName}
                  referrerPolicy="no-referrer"
                  className="w-full h-[280px] sm:h-[360px] object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] uppercase font-black tracking-widest bg-blue-600/90 px-2.5 py-0.5 rounded text-white">
                      Featured Visual
                    </span>
                    <p className="text-xs font-bold mt-1 text-slate-200">
                      {brandName} Outlet Operations & Layout
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* BRAND IMAGE GALLERY */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Layout size={18} className="text-blue-600" /> Brand Image Gallery
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Actual operational locations, interiors, products, and equipment setups for {brandName}.
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {galleryImgs.length} Verified Visuals
            </span>
          </div>

          {/* Desktop Gallery Grid */}
          <div className="hidden md:grid grid-cols-4 gap-4">
            {galleryImgs.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer h-28 group ${
                  selectedImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200 opacity-80 hover:opacity-100'
                }`}
              >
                <img 
                  src={imgUrl} 
                  alt={`${brandName} gallery ${idx + 1}`} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {selectedImageIndex === idx && (
                  <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                    <CheckCircle className="text-blue-600 bg-white rounded-full" size={20} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Horizontal Swipeable Gallery */}
          <div className="md:hidden flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none">
            {galleryImgs.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`snap-center shrink-0 w-64 h-40 rounded-xl overflow-hidden border-2 transition-all relative ${
                  selectedImageIndex === idx ? 'border-blue-600' : 'border-slate-200'
                }`}
              >
                <img 
                  src={imgUrl} 
                  alt={`${brandName} gallery ${idx + 1}`} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </section>

        {/* ABOUT THE BRAND SECTION */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide mb-6 flex items-center gap-2">
            <Building2 size={20} className="text-blue-600" /> About {brandName}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6 text-sm text-slate-700 leading-relaxed">
              <p className="font-medium text-slate-800 text-base">
                {aboutDescription}
              </p>

              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-2">
                <h3 className="font-black text-blue-900 uppercase text-xs tracking-wider">Business & Operational Model</h3>
                <p className="text-slate-700 text-xs leading-relaxed">{businessModel}</p>
                <p className="text-slate-700 text-xs leading-relaxed mt-1">{operationalModel}</p>
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-sm uppercase mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-blue-600" /> Key Brand Advantages
                </h3>
                <ul className="space-y-2.5">
                  {keyAdvantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-5 h-5 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-black text-slate-900 text-xs uppercase mb-1">Target Customer Demographic</h4>
                  <p className="text-slate-600 text-xs">{targetCustomers}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-black text-slate-900 text-xs uppercase mb-1">Expansion Opportunity</h4>
                  <p className="text-slate-600 text-xs">{expansionOpp}</p>
                </div>
              </div>

              {/* Public Contact Information */}
              {(brand.contactPhone || brand.contactEmail || brand.website) && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h3 className="font-black text-slate-900 text-sm uppercase mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" /> Public Contact Information
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {brand.contactPhone && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                        <Phone size={14} className="text-blue-600" /> {brand.contactPhone}
                      </div>
                    )}
                    {brand.contactEmail && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                        <Mail size={14} className="text-blue-600" /> {brand.contactEmail}
                      </div>
                    )}
                    {brand.website && (
                      <a href={brand.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                        <Globe size={14} /> Visit Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Fact Summary Card */}
            <div className="lg:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                Brand Snapshot
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Established Year</span>
                  <span className="font-black text-slate-800">{establishedYearStr}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Industry Sector</span>
                  <span className="font-black text-slate-800">{industryStr}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Space Required</span>
                  <span className="font-black text-slate-800">{spaceRequiredStr}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Active Outlets</span>
                  <span className="font-black text-blue-700">{expectedOutletCountStr}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Verification Status</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={14} /> BrizX Legal Audit Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INVESTMENT OVERVIEW GRID */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide mb-6 flex items-center gap-2">
            <IndianRupee size={20} className="text-blue-600" /> Investment & Commercial Terms Overview
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Investment Required</span>
              <span className="text-lg font-black text-blue-700 mt-1 block">
                {investmentRequiredStr}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Franchise Fee</span>
              <span className="text-base font-black text-slate-900 mt-1 block">
                {franchiseFeeStr}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Royalty Fee</span>
              <span className="text-base font-black text-slate-900 mt-1 block">
                {royaltyFeeStr}
              </span>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Estimated Payback</span>
              <span className="text-base font-black text-emerald-700 mt-1 block">
                {estimatedPaybackStr}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Space Required</span>
              <span className="text-base font-black text-slate-900 mt-1 block">
                {spaceRequiredStr}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Active Outlets</span>
              <span className="text-base font-black text-slate-900 mt-1 block">
                {expectedOutletCountStr}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Business Model</span>
              <span className="text-base font-black text-slate-900 mt-1 block">
                {businessModelTypeStr}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Established</span>
              <span className="text-base font-black text-slate-900 mt-1 block">
                {establishedYearStr}
              </span>
            </div>
          </div>
        </section>

        {/* WHY INVEST IN THIS BRAND */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide mb-6 flex items-center gap-2">
            <Award size={20} className="text-blue-600" /> Why Invest in {brandName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrichedData.whyInvestCards.map((card, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-100/70 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {renderIcon(card.iconName)}
                </div>
                <h3 className="font-black text-slate-900 text-sm mb-1.5">{card.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FRANCHISE APPLICATION FORM SECTION */}
        <section id="application-form" className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 rounded-2xl border-2 border-blue-200 p-6 md:p-10 shadow-md">
          <div className="max-w-3xl mx-auto">
            
            <div className="text-center mb-8">
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2">
                Official Franchise Application
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                APPLY FOR THIS FRANCHISE
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-medium">
                Interested in this opportunity? Submit your details and the {brandName} team will review your application and contact you directly.
              </p>
            </div>

            {isSubmittedSuccess ? (
              <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Application Submitted Successfully
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  Thank you for your interest in <span className="font-extrabold text-blue-700">{brandName}</span>. Our franchise advisory team will review your application profile and contact you shortly at <span className="font-bold text-slate-800">{formData.email}</span>.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl text-left text-xs text-slate-600 border border-slate-200 max-w-md mx-auto space-y-1">
                  <p><span className="font-bold">Applicant:</span> {formData.applicantName}</p>
                  <p><span className="font-bold">Target Brand:</span> {brandName}</p>
                  <p><span className="font-bold">Preferred Location:</span> {formData.preferredLocation}, {formData.city}</p>
                  <p><span className="font-bold">Budget:</span> {formData.investmentBudget}</p>
                </div>

                <button
                  onClick={() => {
                    setIsSubmittedSuccess(false);
                    setFormData({
                      applicantName: '',
                      mobile: '',
                      email: '',
                      whatsApp: '',
                      city: '',
                      state: '',
                      investmentBudget: investmentRequiredStr,
                      availableCapital: '',
                      preferredLocation: '',
                      occupation: '',
                      businessExperience: '',
                      franchiseType: 'FOFO',
                      message: '',
                      agreeTerms: false
                    });
                  }}
                  className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={14} /> Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                
                {/* Required Fields Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className={`w-full bg-slate-50 border ${formErrors.applicantName ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors`}
                    />
                    {formErrors.applicantName && <p className="text-rose-500 text-[10px] mt-1 font-bold">{formErrors.applicantName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full bg-slate-50 border ${formErrors.mobile ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors`}
                    />
                    {formErrors.mobile && <p className="text-rose-500 text-[10px] mt-1 font-bold">{formErrors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      WhatsApp Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsApp}
                      onChange={(e) => setFormData({ ...formData, whatsApp: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rajesh@example.com"
                      className={`w-full bg-slate-50 border ${formErrors.email ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors`}
                    />
                    {formErrors.email && <p className="text-rose-500 text-[10px] mt-1 font-bold">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className={`w-full bg-slate-50 border ${formErrors.city ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors`}
                    />
                    {formErrors.city && <p className="text-rose-500 text-[10px] mt-1 font-bold">{formErrors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Karnataka"
                      className={`w-full bg-slate-50 border ${formErrors.state ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors`}
                    />
                    {formErrors.state && <p className="text-rose-500 text-[10px] mt-1 font-bold">{formErrors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Investment Budget <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.investmentBudget}
                      onChange={(e) => setFormData({ ...formData, investmentBudget: e.target.value })}
                      placeholder="e.g. ₹20 - 30 Lakhs"
                      className={`w-full bg-slate-50 border ${formErrors.investmentBudget ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors`}
                    />
                    {formErrors.investmentBudget && <p className="text-rose-500 text-[10px] mt-1 font-bold">{formErrors.investmentBudget}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Available Liquid Capital <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.availableCapital}
                      onChange={(e) => setFormData({ ...formData, availableCapital: e.target.value })}
                      placeholder="e.g. ₹15 Lakhs Cash / Ready Loans"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Preferred Outlet Location / Catchment Area <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.preferredLocation}
                      onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                      placeholder="e.g. Koramangala, Indiranagar or High Street"
                      className={`w-full bg-slate-50 border ${formErrors.preferredLocation ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors`}
                    />
                    {formErrors.preferredLocation && <p className="text-rose-500 text-[10px] mt-1 font-bold">{formErrors.preferredLocation}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Preferred Franchise Model
                    </label>
                    <select
                      value={formData.franchiseType}
                      onChange={(e) => setFormData({ ...formData, franchiseType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors font-medium cursor-pointer"
                    >
                      <option value="FOFO">FOFO (Franchise Owned, Franchise Operated)</option>
                      <option value="FOCO">FOCO (Franchise Owned, Company Operated)</option>
                      <option value="MULTI_UNIT">Multi-Unit / Master Territory Franchise</option>
                      <option value="KIOSK">Express Kiosk / Cloud Unit</option>
                    </select>
                  </div>
                </div>

                {/* Optional Fields Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">
                      Current Occupation / Business <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      placeholder="e.g. IT Senior Manager / Retail Owner"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">
                      Relevant Business Experience <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.businessExperience}
                      onChange={(e) => setFormData({ ...formData, businessExperience: e.target.value })}
                      placeholder="e.g. 5 years in retail management"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">
                    Message / Additional Information <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details regarding property availability, execution timeline, or specific questions..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-snug">
                      I agree to be contacted regarding this franchise opportunity with <span className="font-bold text-slate-900">{brandName}</span> via phone, email, or WhatsApp.
                    </span>
                  </label>
                  {formErrors.agreeTerms && <p className="text-rose-500 text-[10px] mt-1 font-bold">{formErrors.agreeTerms}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> SUBMIT APPLICATION
                    </>
                  )}
                </button>

              </form>
            )}

          </div>
        </section>

      </div>
    </main>
  );
}
