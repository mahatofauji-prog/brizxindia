import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Role, SeekerDocument, BrandDocument, RegistrationStatus } from '../types';
import { 
  ShieldCheck, CheckCircle2, Lock, ArrowRight, Upload, FileText, 
  Trash2, Mail, Phone, MapPin, Building2, Briefcase, IndianRupee, 
  Sparkles, Save, Clock, AlertCircle, Eye, RefreshCw, ChevronRight, Check
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();
  const { updateBrand, updateSeeker, addApplication } = useData();

  // Primary Workflow Steps: 'verification' | 'profile_form'
  const [workflowStep, setWorkflowStep] = useState<'verification' | 'profile_form'>('verification');
  
  // Role & Email State
  const [role, setRole] = useState<'brand' | 'seeker'>('seeker');
  const [email, setEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [inputOtp, setInputOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  
  // Section Tab State inside Profile Form
  const [activeTab, setActiveTab] = useState<'section_a' | 'section_b' | 'section_c' | 'section_d'>('section_a');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // ==========================================
  // SEEKER FORM STATE
  // ==========================================
  // Section A: Personal Details
  const [seekerFullName, setSeekerFullName] = useState('');
  const [seekerMobile, setSeekerMobile] = useState('');
  const [seekerWhatsApp, setSeekerWhatsApp] = useState('');
  const [seekerDob, setSeekerDob] = useState('');
  const [seekerGender, setSeekerGender] = useState('Male');
  const [seekerAddress, setSeekerAddress] = useState('');
  const [seekerCity, setSeekerCity] = useState('');
  const [seekerState, setSeekerState] = useState('');
  const [seekerCountry, setSeekerCountry] = useState('India');
  const [seekerLinkedIn, setSeekerLinkedIn] = useState('');
  const [seekerBio, setSeekerBio] = useState('');

  // Section B: Experience
  const [seekerHasBizExp, setSeekerHasBizExp] = useState(true);
  const [seekerBizExpDetails, setSeekerBizExpDetails] = useState('');
  const [seekerHasFranExp, setSeekerHasFranExp] = useState(false);
  const [seekerFranExpDetails, setSeekerFranExpDetails] = useState('');
  const [seekerOccupation, setSeekerOccupation] = useState('');
  const [seekerYearsExp, setSeekerYearsExp] = useState('3-5 Years');
  const [seekerBg, setSeekerBg] = useState('Corporate Professional');

  // Section C: Investment Matrix
  const [seekerMinInv, setSeekerMinInv] = useState(15);
  const [seekerMaxInv, setSeekerMaxInv] = useState(35);
  const [seekerAvailableCapital, setSeekerAvailableCapital] = useState(25);
  const [seekerFundingSource, setSeekerFundingSource] = useState('Personal Savings + Equity');
  const [seekerTimeline, setSeekerTimeline] = useState('1-3 Months');
  const [seekerIndustry, setSeekerIndustry] = useState('Food & Beverages');
  const [seekerFranModel, setSeekerFranModel] = useState('FOCO (Franchise Owned Company Operated)');
  const [seekerTargetCities, setSeekerTargetCities] = useState('Bengaluru, Mysore, Pune');
  const [seekerRiskAppetite, setSeekerRiskAppetite] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [seekerVision, setSeekerVision] = useState('');

  // Section D: Documents
  const [seekerDocs, setSeekerDocs] = useState<SeekerDocument[]>([
    { id: 'aadhaar', name: 'Aadhaar_Verification.pdf', size: '1.8 MB', type: 'Aadhaar Card', date: new Date().toISOString().split('T')[0], status: 'PENDING' },
    { id: 'pan', name: 'PAN_Card.pdf', size: '1.2 MB', type: 'PAN Card', date: new Date().toISOString().split('T')[0], status: 'PENDING' }
  ]);

  // ==========================================
  // BRAND FORM STATE
  // ==========================================
  // Section A: Brand Identity
  const [brandName, setBrandName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [brandIndustry, setBrandIndustry] = useState('Food & Beverages');
  const [tagline, setTagline] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [website, setWebsite] = useState('');
  const [foundedYear, setFoundedYear] = useState('2020');
  const [headquarters, setHeadquarters] = useState('Gurugram, Haryana');
  const [brandPhone, setBrandPhone] = useState('');
  const [brandWhatsApp, setBrandWhatsApp] = useState('');

  // Section B: Branding & Media
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  // Section C: Business Details
  const [bizModel, setBizModel] = useState('FOFO / FOCO');
  const [franFee, setFranFee] = useState(5);
  const [brandMinInv, setBrandMinInv] = useState(15);
  const [brandMaxInv, setBrandMaxInv] = useState(30);
  const [expectedRoi, setExpectedRoi] = useState('12 - 18 Months');
  const [franDuration, setFranDuration] = useState('5 Years');
  const [totalOutlets, setTotalOutlets] = useState(15);
  const [expansionPlans, setExpansionPlans] = useState('Targeting Tier 1 and Tier 2 metro hubs across India');
  const [targetCities, setTargetCities] = useState('Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune');
  const [supportProvided, setSupportProvided] = useState<string[]>([
    'Site Selection Assistance', 'Staff Hiring & Training', 'National Marketing', 'POS & Tech Integration'
  ]);
  const [trainingDetails, setTrainingDetails] = useState('Comprehensive 14-day staff and manager training at corporate center');
  const [marketingSupport, setMarketingSupport] = useState('Digital marketing campaign support, promotional collateral');

  // Section D: Documents
  const [brandDocs, setBrandDocs] = useState<BrandDocument[]>([
    { id: 'b_reg', name: 'Incorporation_Cert.pdf', size: '2.5 MB', type: 'Business Registration', date: new Date().toISOString().split('T')[0], status: 'PENDING' },
    { id: 'b_gst', name: 'GSTIN_Certificate.pdf', size: '1.4 MB', type: 'GST Certificate', date: new Date().toISOString().split('T')[0], status: 'PENDING' }
  ]);

  // ==========================================
  // CALCULATE PROFILE COMPLETION PERCENTAGE
  // ==========================================
  const completionPercentage = useMemo(() => {
    let filled = 0;
    let total = 10;

    if (role === 'seeker') {
      if (seekerFullName) filled += 1;
      if (seekerMobile) filled += 1;
      if (seekerCity) filled += 1;
      if (seekerOccupation) filled += 1;
      if (seekerMinInv && seekerMaxInv) filled += 1;
      if (seekerTimeline) filled += 1;
      if (seekerIndustry) filled += 1;
      if (seekerTargetCities) filled += 1;
      if (seekerBio) filled += 1;
      if (seekerDocs.length >= 2) filled += 1;
    } else {
      if (brandName) filled += 1;
      if (companyName) filled += 1;
      if (brandPhone) filled += 1;
      if (brandIndustry) filled += 1;
      if (shortDesc) filled += 1;
      if (website) filled += 1;
      if (brandMinInv && brandMaxInv) filled += 1;
      if (headquarters) filled += 1;
      if (totalOutlets) filled += 1;
      if (brandDocs.length >= 2) filled += 1;
    }

    return Math.round((filled / total) * 100);
  }, [
    role, seekerFullName, seekerMobile, seekerCity, seekerOccupation, 
    seekerMinInv, seekerMaxInv, seekerTimeline, seekerIndustry, seekerTargetCities, 
    seekerBio, seekerDocs, brandName, companyName, brandPhone, brandIndustry, 
    shortDesc, website, brandMinInv, brandMaxInv, headquarters, totalOutlets, brandDocs
  ]);

  // ==========================================
  // OTP HANDLERS
  // ==========================================
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setOtpError('Please enter a valid email address.');
      return;
    }
    setOtpError('');
    // Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp.trim() === generatedOtp || inputOtp.trim() === '123456') {
      setEmailVerified(true);
      setWorkflowStep('profile_form');
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please check the code provided above or use 123456.');
    }
  };

  // ==========================================
  // DOCUMENT UPLOADER SIMULATION
  // ==========================================
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Data = reader.result as string;
      const newDoc = {
        id: 'doc_' + Date.now(),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: docType,
        date: new Date().toISOString().split('T')[0],
        status: 'PENDING' as const,
        fileData: base64Data
      };

      if (role === 'seeker') {
        setSeekerDocs(prev => [...prev.filter(d => d.type !== docType), newDoc]);
      } else {
        setBrandDocs(prev => [...prev.filter(d => d.type !== docType), newDoc]);
      }

      setSaveToast(`Uploaded ${file.name} successfully.`);
      setTimeout(() => setSaveToast(null), 3000);
    };

    reader.readAsDataURL(file);
  };

  // ==========================================
  // SAVE AS DRAFT
  // ==========================================
  const handleSaveDraft = () => {
    const userRole: Role = role === 'brand' ? 'BRAND_OWNER' : 'FRANCHISE_SEEKER';
    
    // Save account state with status DRAFT
    login(email, userRole, {
      name: seekerFullName || brandName || email.split('@')[0],
      email: email,
      phone: seekerMobile || brandPhone || '',
      whatsApp: seekerWhatsApp || brandWhatsApp || seekerMobile || '',
      city: seekerCity || headquarters || 'Delhi',
      state: seekerState || 'Delhi',
      country: seekerCountry || 'India',
      industry: role === 'seeker' ? seekerIndustry : brandIndustry,
      applicationStatus: 'DRAFT',
      emailVerificationStatus: 'email_verified',
      completionPercentage: completionPercentage,
      verified: false
    } as any);

    setSaveToast('Registration progress saved as DRAFT! You can log back in anytime to continue.');
    setTimeout(() => setSaveToast(null), 4000);
  };

  // ==========================================
  // SUBMIT FOR VERIFICATION
  // ==========================================
  const handleSubmitForVerification = (e: React.FormEvent) => {
    e.preventDefault();

    const userRole: Role = role === 'brand' ? 'BRAND_OWNER' : 'FRANCHISE_SEEKER';
    const status: RegistrationStatus = 'PENDING_REVIEW';
    const submittedAt = new Date().toISOString();

    if (role === 'seeker') {
      const seekerData = {
        name: seekerFullName.trim() || email.split('@')[0],
        email: email,
        phone: seekerMobile.trim(),
        whatsApp: seekerWhatsApp.trim() || seekerMobile.trim(),
        dob: seekerDob,
        gender: seekerGender,
        address: seekerAddress.trim(),
        city: seekerCity.trim() || 'Delhi',
        state: seekerState.trim() || 'Delhi',
        country: seekerCountry || 'India',
        linkedInUrl: seekerLinkedIn.trim(),
        bio: seekerBio.trim(),
        hasBusinessExperience: seekerHasBizExp,
        businessExperienceDetails: seekerBizExpDetails,
        hasFranchiseExperience: seekerHasFranExp,
        franchiseExperienceDetails: seekerFranExpDetails,
        occupation: seekerOccupation,
        experience: seekerYearsExp,
        businessBackground: seekerBg,
        investment: seekerAvailableCapital,
        minInvestment: seekerMinInv,
        maxInvestment: seekerMaxInv,
        availableCapital: seekerAvailableCapital,
        fundingSource: seekerFundingSource,
        timeline: seekerTimeline,
        industry: seekerIndustry,
        franchiseType: seekerFranModel,
        preferredCities: seekerTargetCities.split(',').map(s => s.trim()).filter(Boolean),
        preferredIndustries: [seekerIndustry],
        riskAppetite: seekerRiskAppetite,
        entrepreneurshipVision: seekerVision,
        documents: seekerDocs,
        emailVerificationStatus: 'email_verified' as const,
        applicationStatus: status,
        submittedAt: submittedAt,
        completionPercentage: completionPercentage,
        verified: false
      };

      login(email, userRole, seekerData as any);
      
      // Also sync to DataContext
      updateSeeker(email, {
        ...seekerData,
        role: 'FRANCHISE_SEEKER'
      } as any);

      // Create an application audit record
      addApplication({
        brandId: 'b1',
        brandName: 'BrizX Seeker Verification',
        applicantName: seekerFullName,
        mobile: seekerMobile,
        email: email,
        city: seekerCity,
        state: seekerState,
        investmentBudget: `₹${seekerMinInv}-${seekerMaxInv} Lakhs`,
        preferredLocation: seekerTargetCities,
        occupation: seekerOccupation,
        businessExperience: seekerBizExpDetails || seekerYearsExp,
        message: seekerVision || 'Submitted for profile verification'
      });

      navigate('/seeker');
    } else {
      // BRAND OWNER
      const newBrandId = `brand_${Date.now()}`;
      const brandData = {
        id: newBrandId,
        ownerId: newBrandId,
        brandName: brandName.trim() || email.split('@')[0],
        companyName: companyName.trim() || brandName,
        contactPerson: contactPerson.trim(),
        email: email,
        phone: brandPhone.trim(),
        whatsappNumber: brandWhatsApp.trim() || brandPhone.trim(),
        industry: brandIndustry,
        tagline: tagline.trim(),
        description: shortDesc.trim(),
        fullAbout: fullDesc.trim(),
        website: website.trim(),
        establishedYear: parseInt(foundedYear) || 2020,
        headquarters: headquarters.trim(),
        city: headquarters.split(',')[0] || 'Delhi',
        investmentRequired: { min: brandMinInv, max: brandMaxInv },
        minInvestment: brandMinInv,
        maxInvestment: brandMaxInv,
        franchiseFee: franFee,
        roiPayback: expectedRoi,
        paybackPeriod: expectedRoi,
        totalOutlets: totalOutlets,
        outlets: totalOutlets,
        expansionPlans: expansionPlans,
        cityTargets: targetCities.split(',').map(c => c.trim()).filter(Boolean),
        supportProvided: supportProvided,
        trainingDetails: trainingDetails,
        marketingSupport: marketingSupport,
        documents: brandDocs,
        logo: logoUrl || '/file_00000000f5988211884f7bce5b4acfc8~2.jpg',
        coverImage: coverUrl || '',
        emailVerificationStatus: 'email_verified' as const,
        applicationStatus: status,
        submittedAt: submittedAt,
        completionPercentage: completionPercentage,
        verified: false,
        subscriptionTier: 'FREE' as const,
        unlockedLeads: [],
        savedLeads: [],
        brandOrigin: 'new_registration'
      };

      login(email, userRole, brandData as any);
      updateBrand(newBrandId, brandData as any);
      navigate('/brand');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Top Banner Header */}
      <div className="w-full max-w-4xl text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 font-black text-xs uppercase tracking-widest rounded-full mb-3">
          <ShieldCheck size={14} /> Official Account Registration & Verification
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Join BrizX India Partner Portal
        </h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base mt-2">
          Submit your profile for instant verification to connect with India's top brands and verified investors.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
        {/* ============================================================ */}
        {/* STEP 1: EMAIL VERIFICATION FIRST                             */}
        {/* ============================================================ */}
        {workflowStep === 'verification' ? (
          <div className="p-8 md:p-12 max-w-xl mx-auto text-center">
            {/* Role Selection Buttons */}
            <div className="mb-8">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
                1. Select Account Type
              </label>
              <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button 
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    role === 'seeker' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Briefcase size={16} /> Franchise Seeker
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('brand')}
                  className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    role === 'brand' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 size={16} /> Brand Owner
                </button>
              </div>
            </div>

            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2 text-left">
                    2. Official Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com or personal@gmail.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-left">
                    We will send a 6-digit verification code (OTP) to this email before registration.
                  </p>
                </div>

                {otpError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-left flex items-center gap-2">
                    <AlertCircle size={16} /> {otpError}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Send Verification Code <ArrowRight size={16} />
                </button>

                <p className="text-xs text-slate-500 pt-2">
                  Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-left mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-blue-900">Verification OTP Sent</span>
                    <button 
                      type="button" 
                      onClick={() => setIsOtpSent(false)} 
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Edit Email
                    </button>
                  </div>
                  <p className="text-xs font-medium text-blue-800">
                    Verification code sent to <strong>{email}</strong>
                  </p>
                  <div className="mt-3 p-2.5 bg-white rounded-xl border border-blue-200 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Simulated OTP Code:</span>
                    <span className="font-mono text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md tracking-wider">
                      {generatedOtp}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setInputOtp(generatedOtp)}
                      className="text-[11px] text-blue-600 hover:underline font-bold"
                    >
                      Auto-fill
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2 text-left">
                    Enter 6-Digit OTP Code
                  </label>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value)}
                    placeholder="Enter code"
                    className="w-full text-center tracking-[0.5em] text-2xl font-black bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900 focus:border-blue-600 focus:bg-white outline-none"
                  />
                </div>

                {otpError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-left flex items-center gap-2">
                    <AlertCircle size={16} /> {otpError}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl text-sm font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={18} /> Verify Email & Unlock Full Form
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* STEP 2: MULTI-SECTION REGISTRATION & PROFILE FORM           */
          /* ============================================================ */
          <div>
            {/* Header Status & Progress Meter */}
            <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                  <CheckCircle2 size={14} /> Email Verified ({email})
                </div>
                <h2 className="text-xl md:text-2xl font-black">
                  {role === 'seeker' ? 'Franchise Seeker Registration' : 'Brand Owner Partner Registration'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Complete sections below. You can save as DRAFT or submit for review.
                </p>
              </div>

              {/* Progress Meter */}
              <div className="w-full md:w-64 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2">
                  <span className="text-slate-300">Profile Completion</span>
                  <span className="text-blue-400 font-mono text-sm">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Notification Toast */}
            {saveToast && (
              <div className="bg-blue-600 text-white text-xs font-bold px-6 py-3 flex items-center justify-between">
                <span>{saveToast}</span>
                <button onClick={() => setSaveToast(null)} className="hover:opacity-80">✕</button>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('section_a')}
                className={`flex-1 min-w-[140px] py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all text-center ${
                  activeTab === 'section_a' 
                    ? 'border-blue-600 text-blue-700 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Section A: {role === 'seeker' ? 'Personal Details' : 'Brand Identity'}
              </button>
              <button 
                onClick={() => setActiveTab('section_b')}
                className={`flex-1 min-w-[140px] py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all text-center ${
                  activeTab === 'section_b' 
                    ? 'border-blue-600 text-blue-700 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Section B: {role === 'seeker' ? 'Experience & Background' : 'Branding & Media'}
              </button>
              <button 
                onClick={() => setActiveTab('section_c')}
                className={`flex-1 min-w-[140px] py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all text-center ${
                  activeTab === 'section_c' 
                    ? 'border-blue-600 text-blue-700 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Section C: {role === 'seeker' ? 'Investment Matrix' : 'Business Details'}
              </button>
              <button 
                onClick={() => setActiveTab('section_d')}
                className={`flex-1 min-w-[140px] py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all text-center ${
                  activeTab === 'section_d' 
                    ? 'border-blue-600 text-blue-700 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Section D: Document Vault
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmitForVerification} className="p-6 md:p-10 space-y-8">
              {/* ========================================================= */}
              {/* SEEKER FORM SECTIONS                                      */}
              {/* ========================================================= */}
              {role === 'seeker' ? (
                <>
                  {/* SECTION A: PERSONAL DETAILS */}
                  {activeTab === 'section_a' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-slate-900 border-b pb-2">Personal Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Full Name *</label>
                          <input 
                            type="text" 
                            required
                            value={seekerFullName}
                            onChange={(e) => setSeekerFullName(e.target.value)}
                            placeholder="e.g. Vikram Sharma"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Email Address (Verified)</label>
                          <input 
                            type="email" 
                            disabled
                            value={email}
                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Mobile Phone Number *</label>
                          <input 
                            type="tel" 
                            required
                            value={seekerMobile}
                            onChange={(e) => setSeekerMobile(e.target.value)}
                            placeholder="+91 9876543210"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">WhatsApp Number</label>
                          <input 
                            type="tel" 
                            value={seekerWhatsApp}
                            onChange={(e) => setSeekerWhatsApp(e.target.value)}
                            placeholder="+91 9876543210"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Date of Birth</label>
                          <input 
                            type="date" 
                            value={seekerDob}
                            onChange={(e) => setSeekerDob(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Gender</label>
                          <select 
                            value={seekerGender}
                            onChange={(e) => setSeekerGender(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Current City *</label>
                          <input 
                            type="text" 
                            required
                            value={seekerCity}
                            onChange={(e) => setSeekerCity(e.target.value)}
                            placeholder="e.g. Bengaluru"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">State *</label>
                          <input 
                            type="text" 
                            required
                            value={seekerState}
                            onChange={(e) => setSeekerState(e.target.value)}
                            placeholder="e.g. Karnataka"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Country</label>
                          <input 
                            type="text" 
                            value={seekerCountry}
                            onChange={(e) => setSeekerCountry(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-600 uppercase mb-2">Residential Address</label>
                        <input 
                          type="text" 
                          value={seekerAddress}
                          onChange={(e) => setSeekerAddress(e.target.value)}
                          placeholder="House/Flat No., Street, Area"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">LinkedIn Profile URL</label>
                          <input 
                            type="url" 
                            value={seekerLinkedIn}
                            onChange={(e) => setSeekerLinkedIn(e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Short Professional Bio *</label>
                          <textarea 
                            required
                            rows={3}
                            value={seekerBio}
                            onChange={(e) => setSeekerBio(e.target.value)}
                            placeholder="Brief description of your professional experience and franchise interest..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION B: EXPERIENCE */}
                  {activeTab === 'section_b' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-slate-900 border-b pb-2">Business & Franchise Experience</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Current Occupation / Role *</label>
                          <input 
                            type="text" 
                            required
                            value={seekerOccupation}
                            onChange={(e) => setSeekerOccupation(e.target.value)}
                            placeholder="e.g. Senior Tech Manager / Retail Business Owner"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Years of Experience</label>
                          <select 
                            value={seekerYearsExp}
                            onChange={(e) => setSeekerYearsExp(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                          >
                            <option value="1-3 Years">1 - 3 Years</option>
                            <option value="3-5 Years">3 - 5 Years</option>
                            <option value="5-10 Years">5 - 10 Years</option>
                            <option value="10+ Years">10+ Years</option>
                          </select>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-black text-slate-900">Prior Business Experience</span>
                            <p className="text-xs text-slate-500">Have you previously owned or managed a commercial business?</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setSeekerHasBizExp(!seekerHasBizExp)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                              seekerHasBizExp ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {seekerHasBizExp ? 'Yes' : 'No'}
                          </button>
                        </div>
                        {seekerHasBizExp && (
                          <textarea 
                            rows={2}
                            value={seekerBizExpDetails}
                            onChange={(e) => setSeekerBizExpDetails(e.target.value)}
                            placeholder="Details about prior business ownership or management..."
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        )}
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-black text-slate-900">Prior Franchise Experience</span>
                            <p className="text-xs text-slate-500">Have you operated or invested in a franchise before?</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setSeekerHasFranExp(!seekerHasFranExp)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                              seekerHasFranExp ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {seekerHasFranExp ? 'Yes' : 'No'}
                          </button>
                        </div>
                        {seekerHasFranExp && (
                          <textarea 
                            rows={2}
                            value={seekerFranExpDetails}
                            onChange={(e) => setSeekerFranExpDetails(e.target.value)}
                            placeholder="Details about previous franchise brand partnerships..."
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* SECTION C: INVESTMENT MATRIX */}
                  {activeTab === 'section_c' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-slate-900 border-b pb-2">Investment Matrix & Preferences</h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Min Budget (Lakhs) *</label>
                          <input 
                            type="number" 
                            required
                            value={seekerMinInv}
                            onChange={(e) => setSeekerMinInv(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Max Budget (Lakhs) *</label>
                          <input 
                            type="number" 
                            required
                            value={seekerMaxInv}
                            onChange={(e) => setSeekerMaxInv(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Available Capital (Lakhs)</label>
                          <input 
                            type="number" 
                            value={seekerAvailableCapital}
                            onChange={(e) => setSeekerAvailableCapital(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Source of Funding</label>
                          <select 
                            value={seekerFundingSource}
                            onChange={(e) => setSeekerFundingSource(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          >
                            <option value="Personal Savings + Equity">Personal Savings + Equity</option>
                            <option value="Bank Loan / MSME Financing">Bank Loan / MSME Financing</option>
                            <option value="Angel / Partner Investor">Angel / Partner Investor</option>
                            <option value="Family Business Capital">Family Business Capital</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Preferred Investment Timeline</label>
                          <select 
                            value={seekerTimeline}
                            onChange={(e) => setSeekerTimeline(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          >
                            <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
                            <option value="1-3 Months">1 - 3 Months</option>
                            <option value="3-6 Months">3 - 6 Months</option>
                            <option value="6+ Months">6+ Months</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Preferred Industry Sector *</label>
                          <select 
                            value={seekerIndustry}
                            onChange={(e) => setSeekerIndustry(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          >
                            <option value="Food & Beverages">Food & Beverages</option>
                            <option value="Retail & Supermarkets">Retail & Supermarkets</option>
                            <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                            <option value="Education & EdTech">Education & EdTech</option>
                            <option value="Automotive & EV">Automotive & EV</option>
                            <option value="Fitness & Sports">Fitness & Sports</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Preferred Franchise Model</label>
                          <select 
                            value={seekerFranModel}
                            onChange={(e) => setSeekerFranModel(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          >
                            <option value="FOFO (Franchise Owned Franchise Operated)">FOFO (Franchise Owned Franchise Operated)</option>
                            <option value="FOCO (Franchise Owned Company Operated)">FOCO (Franchise Owned Company Operated)</option>
                            <option value="COCO (Company Owned Company Operated)">COCO (Company Owned Company Operated)</option>
                            <option value="Master Franchise Rights">Master Franchise Rights</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-600 uppercase mb-2">Target Cities for Expansion *</label>
                        <input 
                          type="text" 
                          required
                          value={seekerTargetCities}
                          onChange={(e) => setSeekerTargetCities(e.target.value)}
                          placeholder="Comma separated: e.g. Bengaluru, Mysore, Pune"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* SECTION D: DOCUMENT VAULT */}
                  {activeTab === 'section_d' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">Document Vault</h3>
                          <p className="text-xs text-slate-500">Upload identity and business proof for verification badge.</p>
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {seekerDocs.length} Documents Attached
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'aadhaar', label: 'Aadhaar Card / Identity Proof *' },
                          { key: 'pan', label: 'PAN Card *' },
                          { key: 'gst', label: 'GST Registration (Optional)' },
                          { key: 'profile', label: 'Business Profile / Net Worth Cert (Optional)' }
                        ].map((docItem) => {
                          const existing = seekerDocs.find(d => d.type.toLowerCase().includes(docItem.key));
                          return (
                            <div key={docItem.key} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="text-blue-600 shrink-0" size={20} />
                                  <div>
                                    <div className="text-xs font-black text-slate-900">{docItem.label}</div>
                                    {existing ? (
                                      <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                                        <CheckCircle2 size={12} /> {existing.name} ({existing.size})
                                      </div>
                                    ) : (
                                      <div className="text-[11px] text-slate-400 mt-0.5">Not uploaded yet</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <label className="cursor-pointer inline-flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all">
                                <Upload size={14} /> {existing ? 'Replace File' : 'Upload File'}
                                <input 
                                  type="file" 
                                  accept=".pdf,.png,.jpeg,.jpg"
                                  className="hidden" 
                                  onChange={(e) => handleDocUpload(e, docItem.label.split('*')[0].trim())}
                                />
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ========================================================= */
                /* BRAND FORM SECTIONS                                       */
                /* ========================================================= */
                <>
                  {/* SECTION A: BRAND IDENTITY */}
                  {activeTab === 'section_a' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-slate-900 border-b pb-2">Brand Identity & Contact</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Brand Name *</label>
                          <input 
                            type="text" 
                            required
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="e.g. Chai Point Express"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Company / Entity Name *</label>
                          <input 
                            type="text" 
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Mountain Trail Foods Pvt Ltd"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Contact Person *</label>
                          <input 
                            type="text" 
                            required
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                            placeholder="e.g. Amrit Sharma"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Industry / Sector *</label>
                          <select 
                            value={brandIndustry}
                            onChange={(e) => setBrandIndustry(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          >
                            <option value="Food & Beverages">Food & Beverages</option>
                            <option value="Retail & Supermarkets">Retail & Supermarkets</option>
                            <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                            <option value="Education & EdTech">Education & EdTech</option>
                            <option value="Automotive & EV">Automotive & EV</option>
                            <option value="Fitness & Sports">Fitness & Sports</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Contact Phone Number *</label>
                          <input 
                            type="tel" 
                            required
                            value={brandPhone}
                            onChange={(e) => setBrandPhone(e.target.value)}
                            placeholder="+91 9876543210"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Official Website *</label>
                          <input 
                            type="url" 
                            required
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://brandwebsite.com"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-600 uppercase mb-2">Brand Tagline</label>
                        <input 
                          type="text" 
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          placeholder="e.g. India's Largest Fresh Tea & Snack Franchise Network"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-600 uppercase mb-2">Short Description *</label>
                        <textarea 
                          required
                          rows={3}
                          value={shortDesc}
                          onChange={(e) => setShortDesc(e.target.value)}
                          placeholder="2-3 sentences summarizing brand opportunity..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* SECTION B: BRANDING & MEDIA */}
                  {activeTab === 'section_b' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-slate-900 border-b pb-2">Branding & Media Assets</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Brand Logo Image URL</label>
                          <input 
                            type="text" 
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            placeholder="https://... or upload image"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Featured Banner Image URL</label>
                          <input 
                            type="text" 
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            placeholder="https://... image banner"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION C: BUSINESS DETAILS */}
                  {activeTab === 'section_c' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-slate-900 border-b pb-2">Business & Financial Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Min Investment (Lakhs) *</label>
                          <input 
                            type="number" 
                            required
                            value={brandMinInv}
                            onChange={(e) => setBrandMinInv(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Max Investment (Lakhs) *</label>
                          <input 
                            type="number" 
                            required
                            value={brandMaxInv}
                            onChange={(e) => setBrandMaxInv(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Franchise Fee (Lakhs) *</label>
                          <input 
                            type="number" 
                            required
                            value={franFee}
                            onChange={(e) => setFranFee(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Expected Payback / ROI *</label>
                          <input 
                            type="text" 
                            required
                            value={expectedRoi}
                            onChange={(e) => setExpectedRoi(e.target.value)}
                            placeholder="e.g. 12 - 18 Months"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-600 uppercase mb-2">Active Outlets Count *</label>
                          <input 
                            type="number" 
                            required
                            value={totalOutlets}
                            onChange={(e) => setTotalOutlets(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-600 uppercase mb-2">Target Expansion Cities *</label>
                        <input 
                          type="text" 
                          required
                          value={targetCities}
                          onChange={(e) => setTargetCities(e.target.value)}
                          placeholder="Comma separated: Mumbai, Delhi NCR, Bengaluru, Hyderabad"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* SECTION D: DOCUMENT VAULT */}
                  {activeTab === 'section_d' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">Brand Document Vault</h3>
                          <p className="text-xs text-slate-500">Upload corporate registration certificates for verified listing badge.</p>
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {brandDocs.length} Documents Attached
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'b_reg', label: 'Business Registration / CIN Certificate *' },
                          { key: 'b_gst', label: 'GSTIN Certificate *' },
                          { key: 'b_pan', label: 'Company PAN Card (Optional)' },
                          { key: 'b_fdd', label: 'Franchise Disclosure Document / Agreement (Optional)' }
                        ].map((docItem) => {
                          const existing = brandDocs.find(d => d.type.toLowerCase().includes(docItem.key));
                          return (
                            <div key={docItem.key} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="text-blue-600 shrink-0" size={20} />
                                  <div>
                                    <div className="text-xs font-black text-slate-900">{docItem.label}</div>
                                    {existing ? (
                                      <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                                        <CheckCircle2 size={12} /> {existing.name} ({existing.size})
                                      </div>
                                    ) : (
                                      <div className="text-[11px] text-slate-400 mt-0.5">Not uploaded yet</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <label className="cursor-pointer inline-flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all">
                                <Upload size={14} /> {existing ? 'Replace File' : 'Upload File'}
                                <input 
                                  type="file" 
                                  accept=".pdf,.png,.jpeg,.jpg"
                                  className="hidden" 
                                  onChange={(e) => handleDocUpload(e, docItem.label.split('*')[0].trim())}
                                />
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Action Bar: Save Draft & Submit */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} /> Save Progress as DRAFT
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {activeTab !== 'section_d' ? (
                    <button 
                      type="button"
                      onClick={() => {
                        if (activeTab === 'section_a') setActiveTab('section_b');
                        else if (activeTab === 'section_b') setActiveTab('section_c');
                        else if (activeTab === 'section_c') setActiveTab('section_d');
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Next Section <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={16} /> Submit Profile for Verification
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
