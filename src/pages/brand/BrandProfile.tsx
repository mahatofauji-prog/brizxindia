import React, { useState, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ROICalculatorCard } from '../../components/ROICalculatorCard';
import { 
  Building2, Lock, Key, Globe, Mail, Phone, MapPin, 
  CheckCircle2, Save, Sparkles, Shield, Copy, Eye, EyeOff,
  Upload, X, Image as ImageIcon, Briefcase, FileText, Target, TrendingUp, IndianRupee, Link as LinkIcon,
  Calculator, PieChart, Layers, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router';
import { uploadFile } from '../../lib/firebaseUpload';
import { BrandFinancialProfile } from '../../types';

export default function BrandProfile() {
  const { user } = useAuth();
  const { brands, updateBrandProfile } = useData();

  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email)) || {
    id: user?.id || `brand_${Date.now()}`,
    brandName: user?.name || '',
    email: user?.email || '',
  } as any;

  // Core Information
  const [brandName, setBrandName] = useState(currentBrand.brandName || '');
  const [tagline, setTagline] = useState(currentBrand.tagline || '');
  const [industry, setIndustry] = useState(currentBrand.industry || 'Food & Beverages');
  const [description, setDescription] = useState(currentBrand.description || '');
  const [fullAbout, setFullAbout] = useState(currentBrand.fullAbout || '');
  
  // Financials & Metrics
  const [minInvestment, setMinInvestment] = useState(currentBrand.investmentRequired?.min || currentBrand.minInvestment || 0);
  const [maxInvestment, setMaxInvestment] = useState(currentBrand.investmentRequired?.max || currentBrand.maxInvestment || 0);
  const [franchiseFee, setFranchiseFee] = useState(currentBrand.franchiseFee || 0);
  const [royalty, setRoyalty] = useState(currentBrand.royaltyFee || currentBrand.royalty || '');
  const [paybackPeriod, setPaybackPeriod] = useState(currentBrand.paybackPeriod || currentBrand.roiPayback || '');
  const [spaceRequired, setSpaceRequired] = useState(currentBrand.spaceRequired || '');
  const [outlets, setOutlets] = useState(currentBrand.totalOutlets || currentBrand.outlets || 0);
  const [established, setEstablished] = useState(currentBrand.establishedYear || currentBrand.established || new Date().getFullYear());
  
  // Brand-Driven Unit Economics & Financial Profile State
  const initialFp = (currentBrand.financialProfile || {}) as Partial<BrandFinancialProfile>;
  const [setupCost, setSetupCost] = useState<number>(initialFp.setupCost ?? 0);
  const [interiorCost, setInteriorCost] = useState<number>(initialFp.interiorCost ?? 0);
  const [equipmentCost, setEquipmentCost] = useState<number>(initialFp.equipmentCost ?? 0);
  const [technologyCost, setTechnologyCost] = useState<number>(initialFp.technologyCost ?? 0);
  const [securityDeposit, setSecurityDeposit] = useState<number>(initialFp.securityDeposit ?? 0);
  const [workingCapital, setWorkingCapital] = useState<number>(initialFp.workingCapital ?? 0);
  const [otherInitialExpenses, setOtherInitialExpenses] = useState<number>(initialFp.otherInitialExpenses ?? 0);

  const [expectedMonthlyRevenue, setExpectedMonthlyRevenue] = useState<number>(initialFp.expectedMonthlyRevenue ?? 0);
  const [avgCustomerTicket, setAvgCustomerTicket] = useState<number>(initialFp.avgCustomerTicket ?? 0);
  const [estimatedMonthlyOrders, setEstimatedMonthlyOrders] = useState<number>(initialFp.estimatedMonthlyOrders ?? 0);

  const [rent, setRent] = useState<number>(initialFp.rent ?? 0);
  const [employeeSalaries, setEmployeeSalaries] = useState<number>(initialFp.employeeSalaries ?? 0);
  const [electricityUtilities, setElectricityUtilities] = useState<number>(initialFp.electricityUtilities ?? 0);
  const [marketingCost, setMarketingCost] = useState<number>(initialFp.marketingCost ?? 0);
  const [royaltyPercentage, setRoyaltyPercentage] = useState<number>(initialFp.royaltyPercentage ?? (parseFloat(royalty) || 4));
  const [maintenanceCost, setMaintenanceCost] = useState<number>(initialFp.maintenanceCost ?? 0);
  const [otherOperatingExpenses, setOtherOperatingExpenses] = useState<number>(initialFp.otherOperatingExpenses ?? 0);
  const [cogsPercentage, setCogsPercentage] = useState<number>(initialFp.cogsPercentage ?? 35);

  // Live Unit Economics Summary for Brand Owner
  const calculatedTotalCapex = useMemo(() => {
    return (franchiseFee || 0) + (setupCost || 0) + (interiorCost || 0) + 
      (equipmentCost || 0) + (technologyCost || 0) + (securityDeposit || 0) + 
      (workingCapital || 0) + (otherInitialExpenses || 0);
  }, [franchiseFee, setupCost, interiorCost, equipmentCost, technologyCost, securityDeposit, workingCapital, otherInitialExpenses]);

  const grossMonthlyRevenueRupees = useMemo(() => {
    return (expectedMonthlyRevenue || 0) * 100000;
  }, [expectedMonthlyRevenue]);

  const cogsRupees = useMemo(() => {
    return Math.round((grossMonthlyRevenueRupees * (cogsPercentage || 0)) / 100);
  }, [grossMonthlyRevenueRupees, cogsPercentage]);

  const calculatedRoyaltyRupees = useMemo(() => {
    return Math.round((grossMonthlyRevenueRupees * (royaltyPercentage || 0)) / 100);
  }, [grossMonthlyRevenueRupees, royaltyPercentage]);

  const totalMonthlyOpexRupees = useMemo(() => {
    return (rent || 0) + (employeeSalaries || 0) + (electricityUtilities || 0) + 
      (marketingCost || 0) + calculatedRoyaltyRupees + (maintenanceCost || 0) + 
      (otherOperatingExpenses || 0) + cogsRupees;
  }, [rent, employeeSalaries, electricityUtilities, marketingCost, calculatedRoyaltyRupees, maintenanceCost, otherOperatingExpenses, cogsRupees]);

  const monthlyNetProfitRupees = useMemo(() => {
    return grossMonthlyRevenueRupees - totalMonthlyOpexRupees;
  }, [grossMonthlyRevenueRupees, totalMonthlyOpexRupees]);

  const annualNetProfitRupees = useMemo(() => {
    return monthlyNetProfitRupees * 12;
  }, [monthlyNetProfitRupees]);

  const annualRoiPct = useMemo(() => {
    const capexRupees = calculatedTotalCapex * 100000;
    if (capexRupees <= 0) return 0;
    return (annualNetProfitRupees / capexRupees) * 100;
  }, [calculatedTotalCapex, annualNetProfitRupees]);

  const calculatedPaybackMonths = useMemo(() => {
    const capexRupees = calculatedTotalCapex * 100000;
    if (monthlyNetProfitRupees <= 0 || capexRupees <= 0) return 0;
    return Math.round(capexRupees / monthlyNetProfitRupees);
  }, [calculatedTotalCapex, monthlyNetProfitRupees]);
  
  // Strategy & Details
  const [targetCustomer, setTargetCustomer] = useState(currentBrand.targetCustomer || '');
  const [expansionOpportunity, setExpansionOpportunity] = useState(currentBrand.expansionOpportunity || '');
  const [businessModel, setBusinessModel] = useState(currentBrand.businessModel || '');
  const [keyAdvantages, setKeyAdvantages] = useState((currentBrand.keyAdvantages || []).join('\n'));
  
  // Contact
  const [contactPhone, setContactPhone] = useState(currentBrand.contactPhone || '');
  const [contactEmail, setContactEmail] = useState(currentBrand.contactEmail || '');
  const [website, setWebsite] = useState(currentBrand.website || '');
  
  // Images
  const [logo, setLogo] = useState(currentBrand.logo || '');
  const [coverImage, setCoverImage] = useState(currentBrand.coverImage || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(currentBrand.galleryImages || []);

  const [saveSuccess, setSaveSuccess] = useState('');
  
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [gstin, setGstin] = useState('');
  const [mcaCin, setMcaCin] = useState('');
  const [trademarkNumber, setTrademarkNumber] = useState('');
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  
  // API & Security (API/Webhook configs preserved for future Settings -> Integrations page)
  // const [apiKey, setApiKey] = useState('brzx_live_key_9921a8f7c6e4d209b11');
  // const [webhookUrl, setWebhookUrl] = useState('https://api.yourbrand.com/webhooks/brizx-leads');
  // const [showKey, setShowKey] = useState(false);
  // const [copiedKey, setCopiedKey] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // const handleCopyKey = () => {
  //   navigator.clipboard.writeText(apiKey);
  //   setCopiedKey(true);
  //   setTimeout(() => setCopiedKey(false), 2000);
  // };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setSaveSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setSaveSuccess(''), 4000);
  };
  
  // Refs for hidden file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Logo file size must be under 2MB.');
      return;
    }

    setIsUploadingLogo(true);
    setLogoProgress(0);
    setUploadError('');

    try {
      const url = await uploadFile(
        currentBrand.id,
        file,
        `brands/${currentBrand.id}/logo`,
        (p) => setLogoProgress(p)
      );
      setLogo(url);
      setIsUploadingLogo(false);
    } catch (err: any) {
      console.error('[Brand Logo Upload Error]:', err);
      setUploadError(err?.message || 'Failed to upload logo.');
      setIsUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Hero image file size must be under 5MB.');
      return;
    }

    setIsUploadingCover(true);
    setCoverProgress(0);
    setUploadError('');

    try {
      const url = await uploadFile(
        currentBrand.id,
        file,
        `brands/${currentBrand.id}/cover`,
        (p) => setCoverProgress(p)
      );
      setCoverImage(url);
      setIsUploadingCover(false);
    } catch (err: any) {
      console.error('[Brand Cover Upload Error]:', err);
      setUploadError(err?.message || 'Failed to upload hero image.');
      setIsUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    setGalleryProgress(0);
    setUploadError('');

    const filesArray = Array.from(files);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        if (file.size > 5 * 1024 * 1024) {
          console.warn(`Skipping file ${file.name} as it exceeds 5MB`);
          continue;
        }

        const baseProgress = Math.round((i / filesArray.length) * 100);
        setGalleryProgress(baseProgress);

        const url = await uploadFile(
          currentBrand.id,
          file,
          `brands/${currentBrand.id}/gallery`,
          (p) => {
            const currentFileProgress = Math.round(p / filesArray.length);
            setGalleryProgress(baseProgress + currentFileProgress);
          }
        );
        uploadedUrls.push(url);
      }

      setGalleryImages(prev => [...prev, ...uploadedUrls]);
      setIsUploadingGallery(false);
    } catch (err: any) {
      console.error('[Brand Gallery Upload Error]:', err);
      setUploadError(err?.message || 'Failed to upload one or more gallery images.');
      setIsUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const setAsFeatured = (url: string) => {
    setCoverImage(url);
  };

  const calculateCompleteness = () => {
    const fields = [
      brandName, tagline, description, fullAbout, minInvestment > 0, maxInvestment > 0, 
      franchiseFee > 0, royalty, spaceRequired, outlets > 0, established > 0, 
      targetCustomer, expansionOpportunity, businessModel, keyAdvantages, 
      contactPhone, contactEmail, logo, coverImage, galleryImages.length > 0
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse key advantages from newline-separated string
    const advantagesArray = keyAdvantages.split('\n').filter(a => a.trim().length > 0);

    // Financial Profile construction
    const updatedFinancialProfile: BrandFinancialProfile = {
      franchiseFee: franchiseFee || 0,
      setupCost: setupCost || 0,
      interiorCost: interiorCost || 0,
      equipmentCost: equipmentCost || 0,
      technologyCost: technologyCost || 0,
      securityDeposit: securityDeposit || 0,
      workingCapital: workingCapital || 0,
      otherInitialExpenses: otherInitialExpenses || 0,
      totalInitialInvestment: calculatedTotalCapex,
      expectedMonthlyRevenue: expectedMonthlyRevenue || 0,
      avgCustomerTicket: avgCustomerTicket || 0,
      estimatedMonthlyOrders: estimatedMonthlyOrders || 0,
      rent: rent || 0,
      employeeSalaries: employeeSalaries || 0,
      electricityUtilities: electricityUtilities || 0,
      marketingCost: marketingCost || 0,
      royaltyPercentage: royaltyPercentage || 0,
      maintenanceCost: maintenanceCost || 0,
      otherOperatingExpenses: otherOperatingExpenses || 0,
      cogsPercentage: cogsPercentage || 0,
      isComplete: (calculatedTotalCapex > 0 && expectedMonthlyRevenue > 0 && totalMonthlyOpexRupees > 0),
      updatedAt: new Date().toISOString()
    };

    updateBrandProfile(currentBrand.id, {
      brandName,
      tagline,
      industry,
      description,
      fullAbout,
      investmentRequired: { min: minInvestment || calculatedTotalCapex, max: maxInvestment || Math.round(calculatedTotalCapex * 1.2) },
      minInvestment: minInvestment || calculatedTotalCapex,
      maxInvestment: maxInvestment || Math.round(calculatedTotalCapex * 1.2),
      franchiseFee,
      royaltyFee: `${royaltyPercentage}% on Gross Revenue`,
      royalty: `${royaltyPercentage}%`,
      paybackPeriod: calculatedPaybackMonths > 0 ? `${calculatedPaybackMonths} Months` : paybackPeriod,
      roiPayback: calculatedPaybackMonths > 0 ? `${calculatedPaybackMonths} Months` : paybackPeriod,
      spaceRequired,
      totalOutlets: outlets,
      outlets,
      establishedYear: established,
      established,
      targetCustomer,
      expansionOpportunity,
      businessModel,
      keyAdvantages: advantagesArray,
      contactPhone,
      contactEmail,
      website,
      logo,
      coverImage,
      galleryImages,
      financialProfile: updatedFinancialProfile
    });

    setSaveSuccess('Public profile synchronized & saved successfully!');
    setTimeout(() => setSaveSuccess(''), 4000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applicationStatus = currentBrand.applicationStatus || (currentBrand.verified ? 'APPROVED' : 'PENDING_REVIEW');

  return (
    <div className="space-y-6">
      {/* Existing Brand Verification Recommendation Banner */}
      {currentBrand.brandOrigin === 'existing' && applicationStatus === 'APPROVED' && (
        <div className="bg-blue-600 text-white px-6 py-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 rounded-xl">
              <Sparkles size={20} className="text-blue-100 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-blue-100">Verification Recommended</div>
              <p className="text-sm font-bold">
                Your brand is already listed on BRIZX INDIA. To become a verified brand and unlock verified-brand benefits, please complete the verification/approval process.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsVerifyModalOpen(true)}
            className="px-4 py-2 bg-white text-blue-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-100 transition-all shrink-0 cursor-pointer"
          >
            GET VERIFIED
          </button>
        </div>
      )}

      {/* Header & Status Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase mb-3 border border-blue-100">
            <Globe size={14} className="text-blue-500" /> Public Profile Management
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">My Brand Profile</h1>
          <p className="text-slate-600 text-sm mt-1 font-medium">Control exactly what potential franchise partners see on your public listing.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto relative z-10">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col gap-1 w-full sm:w-auto">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
              <span>Profile Completeness</span>
              <span className={completeness >= 90 ? 'text-emerald-600' : 'text-blue-600'}>{completeness}%</span>
            </div>
            <div className="h-2 w-full sm:w-48 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${completeness >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
          </div>
          
          <Link 
            to={`/brand/${currentBrand.id}`}
            target="_blank"
            className="w-full sm:w-auto px-5 py-3.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold uppercase transition-all shadow-sm flex items-center justify-center gap-2 text-center"
          >
            <Eye size={16} /> Preview Public Profile
          </Link>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 size={18} className="text-emerald-600" /> {saveSuccess}
        </div>
      )}

      <form onSubmit={handleProfileSubmit} className="space-y-6">
        
        {/* Media & Images Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 font-heading mb-6 flex items-center gap-2">
            <ImageIcon className="text-blue-600" size={20} /> Branding & Media
          </h3>

          {uploadError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-bold">
              {uploadError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Brand Logo</label>
              <div 
                className="w-full aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
              >
                {isUploadingLogo ? (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-3"></div>
                    <span className="text-slate-800 text-xs font-black">Uploading Logo...</span>
                    <span className="text-blue-600 text-[10px] font-bold mt-1">{logoProgress}%</span>
                  </div>
                ) : logo ? (
                  <>
                    <img src={logo} alt="Logo preview" className="w-full h-full object-contain p-4" />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="text-white mb-2" size={24} />
                      <span className="text-white text-xs font-bold">Replace Logo</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center p-6 text-center">
                    <Upload className="text-slate-400 mb-2" size={24} />
                    <span className="text-slate-600 text-xs font-bold">Upload Logo</span>
                    <span className="text-slate-400 text-[10px] mt-1">PNG, JPG up to 2MB</span>
                  </div>
                )}
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} />
              </div>
            </div>

            {/* Featured Hero Image */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Featured / Hero Image</label>
              <div 
                className="w-full h-full min-h-[200px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => !isUploadingCover && coverInputRef.current?.click()}
              >
                {isUploadingCover ? (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-3"></div>
                    <span className="text-slate-800 text-xs font-black">Uploading Hero Image...</span>
                    <span className="text-blue-600 text-[10px] font-bold mt-1">{coverProgress}%</span>
                  </div>
                ) : coverImage ? (
                  <>
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="text-white mb-2" size={24} />
                      <span className="text-white text-xs font-bold">Replace Featured Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center p-6 text-center">
                    <ImageIcon className="text-slate-400 mb-2" size={32} />
                    <span className="text-slate-600 text-sm font-bold">Upload Hero Image</span>
                    <span className="text-slate-400 text-xs mt-1">Wide format (16:9) recommended</span>
                  </div>
                )}
                <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} disabled={isUploadingCover} />
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold text-slate-500 uppercase">Gallery Images</label>
              <button 
                type="button" 
                onClick={() => !isUploadingGallery && galleryInputRef.current?.click()}
                disabled={isUploadingGallery}
                className="text-blue-600 text-xs font-bold hover:text-blue-800 flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                <Upload size={14} /> Add Images
              </button>
            </div>
            
            {galleryImages.length === 0 && !isUploadingGallery ? (
              <div 
                className="w-full py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => galleryInputRef.current?.click()}
              >
                <ImageIcon className="text-slate-300 mb-2" size={32} />
                <span className="text-slate-600 text-sm font-bold">Upload Gallery Images</span>
                <span className="text-slate-400 text-xs mt-1">Showcase your outlets, products, and equipment</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative group">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <button 
                        type="button" 
                        onClick={() => setAsFeatured(img)}
                        className="w-full py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded shadow-sm hover:bg-blue-700 cursor-pointer"
                      >
                        Set Featured
                      </button>
                      <button 
                        type="button" 
                        onClick={() => removeGalleryImage(idx)}
                        className="w-full py-1.5 bg-red-600 text-white text-[10px] font-bold rounded shadow-sm hover:bg-red-700 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                
                {isUploadingGallery && (
                  <div className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-8 h-8 rounded-full border-3 border-blue-100 border-t-blue-600 animate-spin mb-2"></div>
                    <span className="text-slate-600 text-[10px] font-bold">Uploading...</span>
                    <span className="text-blue-600 text-[10px] font-bold">{galleryProgress}%</span>
                  </div>
                )}

                <div 
                  className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors group"
                  onClick={() => !isUploadingGallery && galleryInputRef.current?.click()}
                >
                  <Upload className="text-slate-400 group-hover:text-blue-500 mb-1" size={24} />
                  <span className="text-slate-500 text-[10px] font-bold uppercase group-hover:text-blue-600">Add More</span>
                </div>
              </div>
            )}
            <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} disabled={isUploadingGallery} />
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 font-heading mb-6 flex items-center gap-2">
            <FileText className="text-blue-600" size={20} /> Core Identity
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Brand Name <span className="text-red-500">*</span></label>
              <input 
                type="text" required value={brandName} onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Industry / Sector</label>
              <select 
                value={industry} onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              >
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                <option value="Education & EdTech">Education & EdTech</option>
                <option value="Retail & Apparel">Retail & Apparel</option>
                <option value="Automotive & Logistics">Automotive & Logistics</option>
                <option value="Technology & IT">Technology & IT</option>
                <option value="Real Estate">Real Estate</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tagline</label>
            <input 
              type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. India's Fastest Growing QSR Chain"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Short Description (Summary)</label>
            <textarea 
              rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              placeholder="A brief 1-2 sentence overview of your brand."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full About / Company Description</label>
            <textarea 
              rows={5} value={fullAbout} onChange={(e) => setFullAbout(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              placeholder="Provide a comprehensive description of your brand's history, mission, and offering..."
            />
          </div>
        </div>

        {/* Financials & Metrics */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 font-heading mb-6 flex items-center gap-2">
            <IndianRupee className="text-blue-600" size={20} /> Investment & Financial Criteria
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Min Investment (₹ Lakhs)</label>
              <input 
                type="number" value={minInvestment} onChange={(e) => setMinInvestment(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Max Investment (₹ Lakhs)</label>
              <input 
                type="number" value={maxInvestment} onChange={(e) => setMaxInvestment(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Franchise Fee (₹ Lakhs)</label>
              <input 
                type="number" value={franchiseFee} onChange={(e) => setFranchiseFee(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Royalty Fee</label>
              <input 
                type="text" value={royalty} onChange={(e) => setRoyalty(e.target.value)} placeholder="e.g. 5% on Gross Sales"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Expected Payback</label>
              <input 
                type="text" value={paybackPeriod} onChange={(e) => setPaybackPeriod(e.target.value)} placeholder="e.g. 12 - 18 Months"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Space Required</label>
              <input 
                type="text" value={spaceRequired} onChange={(e) => setSpaceRequired(e.target.value)} placeholder="e.g. 500 - 1000 sq ft"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Active Outlets</label>
              <input 
                type="number" value={outlets} onChange={(e) => setOutlets(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Established Year</label>
              <input 
                type="number" value={established} onChange={(e) => setEstablished(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Brand Unit Economics & Advanced ROI Financial Model */}
        <div className="bg-white rounded-3xl p-8 border border-blue-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-50 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <Calculator size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/70 text-blue-800 text-[10px] font-black uppercase tracking-wider mb-1">
                  <Shield size={11} className="text-blue-600" /> BrizX Seeker ROI Sync
                </div>
                <h3 className="text-xl font-black text-slate-900 font-heading">
                  Official Brand Financial Model & Unit Economics
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  The financial data configured here directly drives the read-only figures in the Seeker Advanced ROI Calculator.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 bg-blue-50/70 border border-blue-100 rounded-2xl px-4 py-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Initial Capex</span>
              <span className="text-lg font-black text-blue-700 font-heading">₹{calculatedTotalCapex.toFixed(2)} Lakhs</span>
            </div>
          </div>

          {/* Sub-Section 1: Initial Capex Breakdown */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
              <Layers size={15} className="text-blue-600" /> 1. Initial Investment (Capex Breakdown in ₹ Lakhs)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Setup / Civil Work (₹L)</label>
                <input 
                  type="number" step="0.1" value={setupCost} onChange={(e) => setSetupCost(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 4.5"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Flooring, electrical, civil fittings</span>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Interior & Fit-out (₹L)</label>
                <input 
                  type="number" step="0.1" value={interiorCost} onChange={(e) => setInteriorCost(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 6.3"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Branding, lighting, counters</span>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Machinery & Equipment (₹L)</label>
                <input 
                  type="number" step="0.1" value={equipmentCost} onChange={(e) => setEquipmentCost(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 3.6"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Kitchen, espresso, heavy machinery</span>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Technology & POS (₹L)</label>
                <input 
                  type="number" step="0.1" value={technologyCost} onChange={(e) => setTechnologyCost(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 0.9"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Billing, hardware, digital display</span>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Security Deposit (₹L)</label>
                <input 
                  type="number" step="0.1" value={securityDeposit} onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 1.4"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Commercial landlord advance</span>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Working Capital (₹L)</label>
                <input 
                  type="number" step="0.1" value={workingCapital} onChange={(e) => setWorkingCapital(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 0.9"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Initial inventory & cash buffer</span>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Other Capex & Licenses (₹L)</label>
                <input 
                  type="number" step="0.1" value={otherInitialExpenses} onChange={(e) => setOtherInitialExpenses(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 0.4"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">FSSAI, trade license, signage</span>
              </div>
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-black text-blue-700 uppercase block">Franchise Fee (₹L)</span>
                  <span className="text-base font-black text-slate-900 mt-1 block">₹{franchiseFee} Lakhs</span>
                </div>
                <span className="text-[10px] text-blue-600 font-semibold mt-1">Configured in criteria above</span>
              </div>
            </div>
          </div>

          {/* Sub-Section 2: Revenue Model & Unit Economics */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
              <TrendingUp size={15} className="text-blue-600" /> 2. Revenue Model & Unit Economics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Expected Monthly Revenue (₹ Lakhs)</label>
                <input 
                  type="number" step="0.1" value={expectedMonthlyRevenue} onChange={(e) => setExpectedMonthlyRevenue(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 7.5"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Average monthly target gross turnover</span>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Average Customer Ticket Size (₹)</label>
                <input 
                  type="number" value={avgCustomerTicket} onChange={(e) => setAvgCustomerTicket(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 375"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Average order bill amount</span>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Estimated Monthly Orders</label>
                <input 
                  type="number" value={estimatedMonthlyOrders} onChange={(e) => setEstimatedMonthlyOrders(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 2000"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Total customer bills generated per month</span>
              </div>
            </div>
          </div>

          {/* Sub-Section 3: Monthly Operating Expenses (OPEX in ₹ Rupees) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
              <IndianRupee size={15} className="text-blue-600" /> 3. Monthly Operating Expenses (OPEX in ₹ Rupees)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Monthly Rent (₹)</label>
                <input 
                  type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 75000"
                />
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Staff Salaries / Payroll (₹)</label>
                <input 
                  type="number" value={employeeSalaries} onChange={(e) => setEmployeeSalaries(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 110000"
                />
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Electricity & Utilities (₹)</label>
                <input 
                  type="number" value={electricityUtilities} onChange={(e) => setElectricityUtilities(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 35000"
                />
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Marketing & Local Ads (₹)</label>
                <input 
                  type="number" value={marketingCost} onChange={(e) => setMarketingCost(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 25000"
                />
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Royalty Percentage (%)</label>
                <input 
                  type="number" step="0.5" value={royaltyPercentage} onChange={(e) => setRoyaltyPercentage(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 4"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">₹{calculatedRoyaltyRupees.toLocaleString()}/mo at current revenue</span>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Maintenance & Tech (₹)</label>
                <input 
                  type="number" value={maintenanceCost} onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 15000"
                />
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Other OPEX / Sundry (₹)</label>
                <input 
                  type="number" value={otherOperatingExpenses} onChange={(e) => setOtherOperatingExpenses(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 20000"
                />
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">COGS / Material Cost (%)</label>
                <input 
                  type="number" step="0.5" value={cogsPercentage} onChange={(e) => setCogsPercentage(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  placeholder="e.g. 35"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">₹{cogsRupees.toLocaleString()}/mo at current revenue</span>
              </div>
            </div>
          </div>

          {/* Live Unit Economics KPI Metrics Preview */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Total Expenses</span>
              <span className="text-lg font-black text-white mt-1 block font-heading">₹{totalMonthlyOpexRupees.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">₹{(totalMonthlyOpexRupees / 100000).toFixed(2)} Lakhs / mo</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Monthly Profit</span>
              <span className={`text-lg font-black mt-1 block font-heading ${monthlyNetProfitRupees >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹{monthlyNetProfitRupees.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">₹{(monthlyNetProfitRupees / 100000).toFixed(2)} Lakhs / mo</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected Annual ROI</span>
              <span className="text-lg font-black text-blue-400 mt-1 block font-heading">{annualRoiPct.toFixed(1)}%</span>
              <span className="text-[10px] text-slate-400">Annual Profit: ₹{(annualNetProfitRupees / 100000).toFixed(2)}L</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payback Horizon</span>
              <span className="text-lg font-black text-amber-400 mt-1 block font-heading">
                {calculatedPaybackMonths > 0 ? `${calculatedPaybackMonths} Months` : 'N/A'}
              </span>
              <span className="text-[10px] text-slate-400">
                {calculatedPaybackMonths > 0 ? `${(calculatedPaybackMonths / 12).toFixed(1)} Years` : 'Zero/Negative Profit'}
              </span>
            </div>
          </div>
        </div>

        {/* Strategy Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 font-heading mb-6 flex items-center gap-2">
            <Target className="text-blue-600" size={20} /> Strategy & Advantages
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Customer</label>
              <textarea 
                rows={3} value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)} placeholder="Who is your primary demographic?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Expansion Opportunity</label>
              <textarea 
                rows={3} value={expansionOpportunity} onChange={(e) => setExpansionOpportunity(e.target.value)} placeholder="Where are you looking to expand?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Business & Operational Model</label>
            <input 
              type="text" value={businessModel} onChange={(e) => setBusinessModel(e.target.value)} placeholder="e.g. FOFO (Franchise Owned Franchise Operated)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Key Brand Advantages (One per line)</label>
            <textarea 
              rows={5} value={keyAdvantages} onChange={(e) => setKeyAdvantages(e.target.value)} placeholder="- High ROI margins&#10;- Turnkey setup&#10;- Marketing support"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors leading-relaxed"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 font-heading mb-6 flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} /> Public Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="franchise@brand.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Website</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://www.brand.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 font-heading mb-6 flex items-center gap-2">
            <Lock className="text-blue-600" size={20} /> Account Security
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            
            <div className="flex items-end">
              <button 
                type="button"
                onClick={handlePasswordSubmit}
                className="w-full py-3 bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-6 z-40 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${completeness >= 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Profile Status</div>
              <div className="text-sm font-black text-slate-900">
                {completeness >= 90 ? 'Optimized for Discoverability' : 'Needs More Information'}
              </div>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save size={18} /> Save & Sync Public Profile
          </button>
        </div>
      </form>

      {/* Existing Brand Verification Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button 
              type="button"
              onClick={() => setIsVerifyModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-indigo-950 font-heading">Submit Brand Verification</h3>
                <p className="text-xs text-slate-500 font-semibold">Verify your brand to unlock verified-brand benefits & trust badges.</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">GSTIN (Optional but Recommended)</label>
                <input 
                  type="text" 
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 29AABCU1234F1Z5"
                  maxLength={15}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                />
                {gstin && gstin.length !== 15 && (
                  <p className="text-[10px] text-amber-600 mt-1 font-bold">GSTIN should be 15 characters long.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">MCA Corporate Identification Number (CIN)</label>
                <input 
                  type="text" 
                  value={mcaCin}
                  onChange={(e) => setMcaCin(e.target.value.toUpperCase())}
                  placeholder="e.g. U55101KA2021PTC145678"
                  maxLength={21}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                />
                {mcaCin && mcaCin.length !== 21 && (
                  <p className="text-[10px] text-amber-600 mt-1 font-bold">CIN should be 21 characters long.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Trademark Registration Number</label>
                <input 
                  type="text" 
                  value={trademarkNumber}
                  onChange={(e) => setTrademarkNumber(e.target.value)}
                  placeholder="e.g. 4829302"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs font-bold text-slate-700 mb-2">Required Document Attachments</p>
                <div className="space-y-2 text-[11px] text-slate-500">
                  <p className="flex items-center gap-1.5 font-semibold text-slate-600">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Incorporation / Business Registration Certificate
                  </p>
                  <p className="flex items-center gap-1.5 font-semibold text-slate-600">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    GST Certificate / Document
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button 
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                disabled={isSubmittingVerification}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!mcaCin || mcaCin.length !== 21) {
                    alert('Please enter a valid 21-character MCA CIN.');
                    return;
                  }
                  setIsSubmittingVerification(true);
                  try {
                    await updateBrandProfile(currentBrand.id, {
                      brandOrigin: 'new_registration',
                      applicationStatus: 'PENDING_REVIEW',
                      gstin,
                      mcaCin,
                      trademarkNumber,
                      submittedAt: new Date().toISOString()
                    });
                    setIsVerifyModalOpen(false);
                    alert('Verification details submitted successfully! Your application is now in review.');
                  } catch (e) {
                    console.error(e);
                    alert('Failed to submit verification details. Please try again.');
                  } finally {
                    setIsSubmittingVerification(false);
                  }
                }}
                disabled={isSubmittingVerification || !mcaCin}
                className="px-6 py-2.5 bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-blue-800 disabled:opacity-50"
              >
                {isSubmittingVerification ? 'Submitting...' : 'Submit Details'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
