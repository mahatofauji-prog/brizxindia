import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Filter, Building2, MapPin, IndianRupee, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import InvestmentRangeFilter from '../../components/InvestmentRangeFilter';
import { BrandLogo } from '../../components/BrandLogo';
import { SmartMatchForm } from '../../components/SmartMatchForm';
import { SmartMatchResults } from '../../components/SmartMatchResults';
import { SmartMatchInput, getSmartMatchScore } from '../../utils/SmartMatchEngine';

import heroImgBurger from '../../assets/images/hero_burger_kingsway_1788090492672.jpg';
import heroImgChai from '../../assets/images/hero_chai_point_1788090510220.jpg';
import heroImgApollo from '../../assets/images/hero_apollo_health_1788090522801.jpg';
import heroImgFitlab from '../../assets/images/hero_fitlab_1788090537151.jpg';
import heroImgEV from '../../assets/images/hero_ev_charge_1788090551986.jpg';
import heroImgKidzee from '../../assets/images/hero_kidzee_1788090564599.jpg';
import heroImgAIT from '../../assets/images/hero_ait_world_1788090577376.jpg';
import heroImgGen1 from '../../assets/images/hero_generic_1_1788090589987.jpg';
import heroImgGen2 from '../../assets/images/hero_generic_2_1788090605889.jpg';
import heroImgGen3 from '../../assets/images/hero_generic_3_1788090619821.jpg';

const slideImages = [
  heroImgBurger,
  heroImgChai,
  heroImgApollo,
  heroImgFitlab,
  heroImgEV,
  heroImgKidzee,
  heroImgAIT,
  heroImgGen1,
  heroImgGen2,
  heroImgGen3
];

export default function BrandListing() {
  const { brands } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParam = React.useMemo(() => {
    return new URLSearchParams(location.search).get('search') || '';
  }, [location.search]);

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Generate the 10 slides from actual data
  const sliderBrands = React.useMemo(() => {
    return brands.slice(0, 10).map((b, i) => ({
      ...b,
      slideImage: slideImages[i % slideImages.length]
    }));
  }, [brands]);

  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  useEffect(() => {
    if (isPaused || sliderBrands.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderBrands.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, sliderBrands.length]);

  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedMaxInvestment, setSelectedMaxInvestment] = useState<number | null>(null); // null = Any Budget
  const [sortBy, setSortBy] = useState('RECOMMENDED');

  const [smartMatchResults, setSmartMatchResults] = useState<any[] | null>(null);
  const [smartMatchInput, setSmartMatchInput] = useState<SmartMatchInput | null>(null);

  const handleSmartMatchSearch = (input: SmartMatchInput) => {
    setSmartMatchInput(input);
    const scoredBrands = brands.map(brand => {
      const breakdown = getSmartMatchScore(brand, input);
      return {
        ...brand,
        matchBreakdown: breakdown,
        smartMatchScore: breakdown.totalScore
      };
    });
    
    scoredBrands.sort((a, b) => b.smartMatchScore - a.smartMatchScore);
    setSmartMatchResults(scoredBrands);
  };

  // Helper to extract brand investment range { min, max } in Lakhs
  const getBrandInvestmentRange = (brand: any): { min: number; max: number } => {
    let min = 0;
    let max = 0;

    if (brand.investmentRequired) {
      if (typeof brand.investmentRequired === 'object' && brand.investmentRequired !== null) {
        min = Number(brand.investmentRequired.min) || 0;
        max = Number(brand.investmentRequired.max) || min;
      } else if (typeof brand.investmentRequired === 'number') {
        const val = brand.investmentRequired > 1000 ? brand.investmentRequired / 100000 : brand.investmentRequired;
        min = val;
        max = val;
      }
    } else {
      min = Number(brand.minInvestment) || 0;
      max = Number(brand.maxInvestment) || min;
    }

    if (max < min) max = min;
    return { min, max };
  };

  // Filter logic: Only display approved / verified brands publicly
  const filteredBrands = brands.filter((brand) => {
    const status = brand.applicationStatus ? String(brand.applicationStatus).toLowerCase() : '';
    const isApproved = status === 'approved' || (brand.verified && status !== 'rejected' && status !== 'pending_review' && status !== 'under_review' && status !== 'draft');
    if (!isApproved) return false;

    const brandName = brand.brandName || '';
    const industry = brand.industry || '';
    const description = brand.description || '';

    const matchesSearch =
      brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry =
      selectedIndustry === 'ALL' || industry.toUpperCase() === selectedIndustry.toUpperCase();

    let matchesInvestment = true;
    if (selectedMaxInvestment !== null) {
      const { min } = getBrandInvestmentRange(brand);
      matchesInvestment = min <= selectedMaxInvestment;
    }

    return matchesSearch && matchesIndustry && matchesInvestment;
  });

  // Sort logic
  const sortedBrands = [...filteredBrands].sort((a, b) => {
    // Featured listings appear before standard listings
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    const invA = getBrandInvestmentRange(a).min;
    const invB = getBrandInvestmentRange(b).min;
    if (sortBy === 'INVESTMENT_LOW') return invA - invB;
    if (sortBy === 'INVESTMENT_HIGH') return invB - invA;
    return 0; // RECOMMENDED
  });


  return (
    <main className="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section (16:9 Animated Background) */}
        <div 
          className="mb-12 relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 group cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => {
            const currentBrand = sliderBrands[currentImageIndex];
            if (currentBrand) navigate(`/brands/${currentBrand.id}`);
          }}
        >
          <AnimatePresence mode="popLayout">
            {sliderBrands.length > 0 && (
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${sliderBrands[currentImageIndex].slideImage}')` }}
              />
            )}
          </AnimatePresence>

          {/* Dark-to-transparent gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent pointer-events-none" />
          
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8 md:p-12 pointer-events-none">
            {sliderBrands.length > 0 && (
              <motion.div 
                key={`content-${currentImageIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start sm:items-end gap-4"
              >
                <BrandLogo
                  logo={sliderBrands[currentImageIndex].logo}
                  brandName={sliderBrands[currentImageIndex].brandName}
                  industry={sliderBrands[currentImageIndex].industry}
                  verified={sliderBrands[currentImageIndex].verified}
                  size="lg"
                  className="shadow-2xl ring-4 ring-white shrink-0"
                />
                <div className="text-white drop-shadow-xl mt-2 sm:mt-0">
                  {sliderBrands[currentImageIndex].verified && (
                    <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 w-max mb-2">
                      <ShieldCheck size={12} strokeWidth={3} /> Verified
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight sm:leading-none mb-1 group-hover:text-blue-200 transition-colors line-clamp-1">
                    {sliderBrands[currentImageIndex].brandName}
                  </h1>
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-200 block">
                    {sliderBrands[currentImageIndex].industry}
                  </span>
                </div>
              </motion.div>
            )}
            
            {/* Slider Navigation Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-auto">
              {sliderBrands.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex 
                      ? 'w-8 bg-blue-500' 
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Smart Match Form */}
        <SmartMatchForm onSearch={handleSmartMatchSearch} />

        {smartMatchResults ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Smart Match Results</h2>
              <button 
                onClick={() => setSmartMatchResults(null)}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear Search
              </button>
            </div>
            <SmartMatchResults results={smartMatchResults} />
          </div>
        ) : (
          <>
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative w-full lg:w-96">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by brand name, industry or keyword..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-600">
                  <Filter size={14} className="text-blue-600" />
                  <span>Industry:</span>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="bg-transparent text-blue-700 font-extrabold outline-none cursor-pointer"
                  >
                    <option value="ALL">All Industries</option>
                    <option value="FOOD & BEVERAGES">Food & Beverage</option>
                    <option value="HEALTHCARE">Healthcare</option>
                    <option value="EDUCATION">Education</option>
                    <option value="RETAIL">Retail</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="HOME & BUILDING AUTOMATION">Automation</option>
                  </select>
                </div>

                <InvestmentRangeFilter
                  selectedMaxLakhs={selectedMaxInvestment}
                  onChange={setSelectedMaxInvestment}
                />

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-600 ml-auto lg:ml-0">
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-blue-700 font-extrabold outline-none cursor-pointer"
                  >
                    <option value="RECOMMENDED">Recommended</option>
                    <option value="INVESTMENT_LOW">Investment: Low to High</option>
                    <option value="INVESTMENT_HIGH">Investment: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Brand Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {sortedBrands.map((brand) => {
                const { min, max } = getBrandInvestmentRange(brand);
                const cover = brand.coverImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80';


            return (
              <div
                key={brand.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Brand Image Banner */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={cover}
                      alt={brand.brandName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      {brand.badge ? (
                        <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                          {brand.badge}
                        </span>
                      ) : <span />}

                      {brand.verified && (
                        <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <ShieldCheck size={12} /> Verified
                        </span>
                      )}
                    </div>

                    {/* Overlay Logo & Name */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3 z-10">
                      <BrandLogo
                        logo={brand.logo}
                        brandName={brand.brandName}
                        industry={brand.industry}
                        verified={brand.verified}
                        size="md"
                        className="shadow-md ring-2 ring-white"
                      />
                      <div className="text-white drop-shadow-md">
                        <Link to={`/brands/${brand.id}`}>
                          <h3 className="text-lg font-black leading-tight text-white hover:text-blue-200 transition-colors">
                            {brand.brandName}
                          </h3>
                        </Link>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">
                          {brand.industry}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-slate-600 text-xs leading-relaxed mb-6 line-clamp-2 font-medium">
                      {brand.description || 'Premier franchise opportunity with established operational framework and high-growth potential across targeted Indian markets.'}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">Investment</span>
                        <span className="text-sm font-black text-blue-700">
                          ₹{min} - ₹{max} Lakhs
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">Franchise Fee</span>
                        <span className="text-sm font-black text-slate-800">
                          {brand.franchiseFee
                            ? brand.franchiseFee < 100
                              ? `₹${brand.franchiseFee} Lakhs`
                              : `₹${(brand.franchiseFee / 100000).toFixed(1)} Lakhs`
                            : 'Contact'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">Space Req.</span>
                        <span className="text-xs font-bold text-slate-700">{brand.spaceRequired || '300-600 sq ft'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">Outlet Count</span>
                        <span className="text-xs font-bold text-slate-700">{brand.totalOutlets || (brand as any).outlets || 50}+ Outlets</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link
                    to={`/brands/${brand.id}`}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    View Brand Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {sortedBrands.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center my-8">
            <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-blue-700 mb-1">No Brands Found</h3>
            <p className="text-slate-500 text-sm">Try relaxing your search terms or filter selection.</p>
          </div>
        )}
        </>
        )}
      </div>
    </main>
  );
}
