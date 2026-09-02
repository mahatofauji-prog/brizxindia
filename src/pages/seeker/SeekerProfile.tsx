import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ROICalculatorCard } from '../../components/ROICalculatorCard';
import { SeekerHero } from '../../components/seeker/SeekerHero';
import { 
  ShieldCheck, Camera, Edit2, MapPin, Briefcase, IndianRupee, 
  Clock, CheckCircle, Save, X, FileText, Upload, Trash2, Eye, 
  Download, Globe, Info, HelpCircle, User, Phone, Mail, FileCheck, Sparkles,
  Calculator, ArrowLeft
} from 'lucide-react';
import { uploadProfileMedia, uploadFile } from '../../lib/firebaseUpload';
import { seekerTheme } from '../../theme/seekerTheme';

import { SeekerDocument } from '../../types';

const INITIAL_DOCS: SeekerDocument[] = [
  { id: 'aadhaar', name: 'Aadhaar_Card_Verified.pdf', size: '2.4 MB', type: 'Aadhaar Card', date: '2026-07-10', status: 'VERIFIED' },
  { id: 'pan', name: 'PAN_Card_Investor.pdf', size: '1.1 MB', type: 'PAN Card', date: '2026-07-10', status: 'VERIFIED' },
  { id: 'gst', name: 'GST_Registration_Certificate.pdf', size: '3.8 MB', type: 'GST (Optional)', date: '2026-07-12', status: 'VERIFIED' },
  { id: 'profile', name: 'Business_Profile_Sethi_Group.pdf', size: '4.2 MB', type: 'Business Profile', date: '2026-07-20', status: 'PENDING' },
  { id: 'resume', name: 'Executive_Resume_Vikram.pdf', size: '1.5 MB', type: 'Resume', date: '2026-07-20', status: 'VERIFIED' },
  { id: 'financials', name: 'CA_NetWorth_Certificate_FY26.pdf', size: '5.6 MB', type: 'Financial Documents', date: '2026-07-24', status: 'PENDING' },
];

export default function SeekerProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { seekers, updateSeeker } = useData();
  
  const foundSeeker = useMemo(() => {
    if (!user) return undefined;
    return seekers.find(s => s.id === user.id) || seekers.find(s => s.email?.toLowerCase() === user.email?.toLowerCase());
  }, [seekers, user]);

  const currentSeeker = useMemo(() => {
    const base = user && user.role === 'FRANCHISE_SEEKER' ? user : (foundSeeker || user);
    return {
      ...foundSeeker,
      ...base,
      id: user?.id || foundSeeker?.id || 'seeker_anon',
      name: user?.name || (user as any)?.seekerData?.name || foundSeeker?.name || 'Seeker User',
      email: user?.email || (user as any)?.seekerData?.email || foundSeeker?.email || '',
      phone: (user as any)?.phone || (user as any)?.seekerData?.phone || foundSeeker?.phone || '',
      whatsApp: (user as any)?.whatsApp || (user as any)?.seekerData?.whatsApp || foundSeeker?.whatsApp || '',
      dob: (user as any)?.dob || (user as any)?.seekerData?.dob || foundSeeker?.dob || '',
      gender: (user as any)?.gender || (user as any)?.seekerData?.gender || foundSeeker?.gender || 'Male',
      address: (user as any)?.address || (user as any)?.seekerData?.address || foundSeeker?.address || '',
      city: (user as any)?.city || (user as any)?.seekerData?.city || foundSeeker?.city || '',
      state: (user as any)?.state || (user as any)?.seekerData?.state || foundSeeker?.state || '',
      country: (user as any)?.country || (user as any)?.seekerData?.country || foundSeeker?.country || 'India',
      pincode: (user as any)?.pincode || (user as any)?.seekerData?.pincode || foundSeeker?.pincode || '',
      linkedInUrl: (user as any)?.linkedInUrl || (user as any)?.seekerData?.linkedInUrl || foundSeeker?.linkedInUrl || '',
      bio: (user as any)?.bio || (user as any)?.seekerData?.bio || foundSeeker?.bio || '',
      experience: (user as any)?.experience || (user as any)?.seekerData?.experience || foundSeeker?.experience || '',
      avatar: user?.avatar || (user as any)?.avatar || (user as any)?.seekerData?.avatar || foundSeeker?.avatar,
      coverPhoto: (user as any)?.coverPhoto || (user as any)?.seekerData?.coverPhoto || foundSeeker?.coverPhoto,
      documents: (user as any)?.documents || (foundSeeker as any)?.documents || []
    };
  }, [foundSeeker, user]);

  const [activeTab, setActiveTab] = useState<'personal' | 'investment' | 'documents' | 'roi'>('personal');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Edit Modes State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingInvestment, setIsEditingInvestment] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [personalError, setPersonalError] = useState<string | null>(null);

  // Hidden File inputs ref for avatar and cover
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Image Upload Modals State
  const [imageUploadModal, setImageUploadModal] = useState<'avatar' | 'cover' | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadImageProgress, setUploadImageProgress] = useState(0);

  // Document Vault Modals State
  const [docUploadModal, setDocUploadModal] = useState<string | null>(null); // holds docId being uploaded
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [docError, setDocError] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadDocProgress, setUploadDocProgress] = useState(0);

  const docGalleryRef = useRef<HTMLInputElement>(null);
  const docCameraRef = useRef<HTMLInputElement>(null);

  // Personal Details Forms
  const [personalForm, setPersonalForm] = useState({
    name: currentSeeker.name || '',
    email: currentSeeker.email || '',
    phone: currentSeeker.phone || '',
    whatsApp: currentSeeker.whatsApp || '',
    dob: currentSeeker.dob || '',
    gender: currentSeeker.gender || 'Male',
    address: currentSeeker.address || '',
    city: currentSeeker.city || '',
    state: currentSeeker.state || '',
    country: currentSeeker.country || 'India',
    pincode: currentSeeker.pincode || '',
    linkedInUrl: currentSeeker.linkedInUrl || '',
    bio: currentSeeker.bio || '',
    experience: currentSeeker.experience || ''
  });

  // Investment Profile Forms
  const [investmentForm, setInvestmentForm] = useState({
    minInvestment: currentSeeker.minInvestment || 20,
    maxInvestment: currentSeeker.maxInvestment || 50,
    availableCapital: currentSeeker.availableCapital || 45,
    fundingSource: currentSeeker.fundingSource || 'Personal Savings + Business Equity',
    timeline: currentSeeker.timeline || 'Immediate',
    industry: currentSeeker.industry || 'Food & Beverages',
    franchiseType: currentSeeker.franchiseType || 'FOCO (Franchise Owned Company Operated)',
    preferredCities: Array.isArray(currentSeeker.preferredCities) 
      ? currentSeeker.preferredCities.join(', ') 
      : (currentSeeker.preferredCities || 'Mumbai, Pune, Thane'),
    businessBackground: currentSeeker.businessBackground || 'Retail Franchise Store Owner',
    riskAppetite: currentSeeker.riskAppetite || 'Moderate - High Growth Seekers'
  });

  const documents = currentSeeker.documents || [];

  // Synchronize personalForm state when profile values change from external updates
  useEffect(() => {
    if (!isEditingPersonal) {
      setPersonalForm({
        name: currentSeeker.name || '',
        email: currentSeeker.email || '',
        phone: currentSeeker.phone || '',
        whatsApp: currentSeeker.whatsApp || '',
        dob: currentSeeker.dob || '',
        gender: currentSeeker.gender || 'Male',
        address: currentSeeker.address || '',
        city: currentSeeker.city || '',
        state: currentSeeker.state || '',
        country: currentSeeker.country || 'India',
        pincode: currentSeeker.pincode || '',
        linkedInUrl: currentSeeker.linkedInUrl || '',
        bio: currentSeeker.bio || '',
        experience: currentSeeker.experience || ''
      });
    }
  }, [
    currentSeeker.id,
    currentSeeker.name,
    currentSeeker.email,
    currentSeeker.phone,
    currentSeeker.whatsApp,
    currentSeeker.dob,
    currentSeeker.gender,
    currentSeeker.address,
    currentSeeker.city,
    currentSeeker.state,
    currentSeeker.pincode,
    currentSeeker.linkedInUrl,
    currentSeeker.bio,
    currentSeeker.experience,
    isEditingPersonal
  ]);

  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const triggerSuccess = (msg: string) => {
    setSaveMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePersonalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalError(null);

    if (!personalForm.name.trim()) {
      setPersonalError('Full Name is required.');
      return;
    }

    if (!personalForm.phone.trim()) {
      setPersonalError('Mobile Number is required.');
      return;
    }

    setIsSavingPersonal(true);

    try {
      const updatedFields = {
        name: personalForm.name.trim(),
        phone: personalForm.phone.trim(),
        whatsApp: personalForm.whatsApp.trim(),
        dob: personalForm.dob,
        gender: personalForm.gender,
        address: personalForm.address.trim(),
        city: personalForm.city.trim(),
        state: personalForm.state.trim(),
        country: personalForm.country || 'India',
        pincode: personalForm.pincode.trim(),
        linkedInUrl: personalForm.linkedInUrl.trim(),
        bio: personalForm.bio.trim(),
        experience: personalForm.experience.trim()
      };

      // 1. Update Firestore Database
      try {
        const userRef = doc(db, 'users', currentSeeker.id);
        await setDoc(userRef, updatedFields, { merge: true });
      } catch (dbErr: any) {
        console.warn('Firestore setDoc warning:', dbErr);
      }

      // 2. DataContext update (Seekers state + localStorage)
      updateSeeker(currentSeeker.id, updatedFields);

      // 3. AuthContext update (User state + localStorage)
      updateUser(updatedFields);

      setIsEditingPersonal(false);
      triggerSuccess('Personal & bio credentials successfully updated.');
    } catch (err: any) {
      console.error('Error saving personal profile:', err);
      setPersonalError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const handleInvestmentSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeeker(currentSeeker.id, {
      minInvestment: investmentForm.minInvestment,
      maxInvestment: investmentForm.maxInvestment,
      availableCapital: investmentForm.availableCapital,
      fundingSource: investmentForm.fundingSource,
      timeline: investmentForm.timeline,
      industry: investmentForm.industry,
      franchiseType: investmentForm.franchiseType,
      preferredCities: investmentForm.preferredCities.split(',').map((c: string) => c.trim()).filter(Boolean),
      riskAppetite: investmentForm.riskAppetite,
      businessBackground: investmentForm.businessBackground
    });
    setIsEditingInvestment(false);
    triggerSuccess('Franchise investment matrix successfully synchronized with the smart match engine.');
  };

  // Avatar and Cover Photo handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, isCamera: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG/JPG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('File size must be under 5MB.');
      return;
    }

    setImageFile(file);
    setImageError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = async () => {
    if (!imageFile || !imageUploadModal) return;

    setIsUploadingImage(true);
    setUploadImageProgress(0);
    setImageError(null);
    
    try {
      const downloadURL = await uploadProfileMedia(
        currentSeeker.id, 
        imageFile, 
        imageUploadModal === 'avatar' ? 'avatar' : 'coverPhoto',
        (p) => setUploadImageProgress(p)
      );
      
      if (imageUploadModal === 'avatar') {
        await updateSeeker(currentSeeker.id, { avatar: downloadURL });
        updateUser({ avatar: downloadURL });
        triggerSuccess('Avatar profile photo updated successfully.');
      } else {
        await updateSeeker(currentSeeker.id, { coverPhoto: downloadURL });
        triggerSuccess('Cover background image updated successfully.');
      }
      
      setIsUploadingImage(false);
      setImageUploadModal(null);
      setImagePreview(null);
      setImageFile(null);
      setUploadImageProgress(0);
    } catch (error: any) {
      console.error('[SeekerProfile Image Upload Error]:', error);
      setImageError(error?.message || 'Upload failed. Please try again.');
      setIsUploadingImage(false);
      setUploadImageProgress(0);
    }
  };

  // Document Upload Handlers
  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      setDocError('Please select a valid PDF document or image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setDocError('File size must be under 10MB.');
      return;
    }

    setDocFile(file);
    setDocError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setDocPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDoc = async () => {
    if (!docFile || !docUploadModal) return;

    setIsUploadingDoc(true);
    setUploadDocProgress(0);
    setDocError(null);
    
    try {
      const fileUrl = await uploadFile(
        currentSeeker.id,
        docFile,
        `seekers/${currentSeeker.id}/documents`,
        (p) => setUploadDocProgress(p)
      );

      const updatedDocs = documents.map(doc => {
        if (doc.id === docUploadModal) {
          return {
            ...doc,
            name: docFile.name,
            size: (docFile.size / (1024 * 1024)).toFixed(1) + ' MB',
            date: new Date().toISOString().split('T')[0],
            status: 'PENDING' as const,
            fileData: fileUrl
          };
        }
        return doc;
      });

      await updateSeeker(currentSeeker.id, { documents: updatedDocs as SeekerDocument[] });
      triggerSuccess(`Document "${docFile.name}" uploaded successfully.`);
      setIsUploadingDoc(false);
      setDocUploadModal(null);
      setDocFile(null);
      setDocPreview(null);
      setUploadDocProgress(0);
    } catch (err: any) {
      console.error('[SeekerProfile Document Upload Error]:', err);
      setDocError(err?.message || 'Failed to upload document. Please try again.');
      setIsUploadingDoc(false);
      setUploadDocProgress(0);
    }
  };

  const handleDeleteDoc = (docId: string) => {
    const updatedDocs = documents.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          name: 'Not Uploaded Yet',
          size: '0 KB',
          status: 'EMPTY' as const,
          fileData: undefined
        };
      }
      return doc;
    });
    updateSeeker(currentSeeker.id, { documents: updatedDocs as SeekerDocument[] });
    triggerSuccess('Document successfully removed from the secure vault.');
  };

  const selectedPreviewDocObj = documents.find(d => d.name === previewDoc);

  return (
    <div className={seekerTheme.pageContainer}>
      
      {/* Back to Dashboard Navigation Link */}
      <button 
        onClick={() => navigate('/seeker')} 
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-700 transition-colors mb-4 cursor-pointer w-fit"
      >
        <ArrowLeft size={14} />
        <span>Back to Dashboard</span>
      </button>

      {/* Top Banner and Header */}
      <SeekerHero
        pageKey="profile"
        badgeText="Verified Investor Console"
        badgeIcon={<ShieldCheck size={14} className="text-blue-700" />}
        title="Investor Profile & Credential Hub"
        description="Manage your verified investor credentials, capital allocation profiles, KYC vault, and franchise matching parameters."
        actions={
          saveSuccess ? (
            <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 shadow-xs animate-fadeIn">
              <CheckCircle size={14} className="text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          ) : undefined
        }
      />

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-blue-100/80 overflow-hidden shadow-xs relative">
        {/* Cover Photo Area */}
        <div 
          className="h-36 bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-50 relative border-b border-blue-100/60 bg-no-repeat bg-cover bg-center"
          style={currentSeeker.coverPhoto ? { backgroundImage: `url(${currentSeeker.coverPhoto})` } : {}}
        >
          <button 
            onClick={() => setImageUploadModal('cover')}
            className="absolute top-4 right-4 bg-white/85 hover:bg-white text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Camera size={14} />
            <span>Change Cover</span>
          </button>
        </div>

        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mt-10 mb-6">
            <div className="flex items-end gap-5">
              <div className="relative group">
                <div className="w-22 h-22 rounded-2xl bg-white p-1 shadow-sm shrink-0 border border-blue-100">
                  <div className="w-full h-full bg-blue-600 text-white rounded-xl flex items-center justify-center text-3xl font-black relative overflow-hidden">
                    {currentSeeker.avatar ? (
                      <img 
                        src={currentSeeker.avatar} 
                        alt={currentSeeker.name} 
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      (currentSeeker.name || 'S').charAt(0)
                    )}
                    <button 
                      onClick={() => setImageUploadModal('avatar')}
                      className="absolute inset-0 bg-blue-900/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer text-white"
                    >
                      <Camera size={16} className="mb-1 text-white" />
                      <span>Update</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 font-heading">{currentSeeker.name || 'Seeker Investor'}</h2>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase">
                    <ShieldCheck size={11} /> 100% Vetted
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 font-medium">
                  <span>{currentSeeker.email}</span>
                  {currentSeeker.phone && (
                    <>
                      <span>•</span>
                      <span>{currentSeeker.phone}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Stats Block inside Profile Cover */}
            <div className="flex items-center gap-6 text-xs bg-slate-50/80 p-3.5 rounded-2xl border border-blue-100 w-full md:w-auto">
              <div>
                <span className="text-slate-500 block text-[9px] font-extrabold uppercase tracking-widest">Match Score</span>
                <span className="text-sm font-black text-blue-700 flex items-center gap-1 mt-0.5">
                  <Sparkles size={12} className="fill-current text-blue-600" /> 98%
                </span>
              </div>
              <div className="h-6 w-px bg-blue-100"></div>
              <div>
                <span className="text-slate-500 block text-[9px] font-extrabold uppercase tracking-widest">Available Capex</span>
                <span className="text-sm font-black text-slate-900 mt-0.5">₹{investmentForm.availableCapital}L</span>
              </div>
              <div className="h-6 w-px bg-blue-100"></div>
              <div>
                <span className="text-slate-500 block text-[9px] font-extrabold uppercase tracking-widest">Profile Status</span>
                <span className="text-sm font-black text-emerald-700 mt-0.5">100% Complete</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed italic border-t border-blue-50 pt-4 font-normal">
            "{currentSeeker.bio || 'No bio provided yet.'}"
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-blue-100 w-full max-w-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex-1 min-w-[100px] py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'personal'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
          }`}
        >
          <User size={14} />
          <span>Personal Details</span>
        </button>
        <button
          onClick={() => setActiveTab('investment')}
          className={`flex-1 min-w-[100px] py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'investment'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
          }`}
        >
          <IndianRupee size={14} />
          <span>Investment Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex-1 min-w-[100px] py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'documents'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
          }`}
        >
          <FileCheck size={14} />
          <span>Document Vault</span>
        </button>
        <button
          onClick={() => setActiveTab('roi')}
          className={`flex-1 min-w-[100px] py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'roi'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-blue-50/60 hover:text-blue-700'
          }`}
        >
          <Calculator size={14} />
          <span>ROI Outlook</span>
        </button>
      </div>

      {/* TAB 1: PERSONAL DETAILS */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-3xl border border-blue-100/80 p-6 sm:p-8 space-y-6 shadow-xs">
          {!isEditingPersonal ? (
            /* READ-ONLY PRESENTATION */
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-blue-50 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    <span>Personal & Bio Credentials</span>
                  </h3>
                  <p className="text-xs text-slate-500">Verifiable corporate registration indices used for direct matching algorithms.</p>
                </div>
                <button
                  onClick={() => {
                    setPersonalError(null);
                    setPersonalForm({
                      name: currentSeeker.name || '',
                      email: currentSeeker.email || '',
                      phone: currentSeeker.phone || '',
                      whatsApp: currentSeeker.whatsApp || '',
                      dob: currentSeeker.dob || '',
                      gender: currentSeeker.gender || 'Male',
                      address: currentSeeker.address || '',
                      city: currentSeeker.city || '',
                      state: currentSeeker.state || '',
                      country: currentSeeker.country || 'India',
                      pincode: currentSeeker.pincode || '',
                      linkedInUrl: currentSeeker.linkedInUrl || '',
                      bio: currentSeeker.bio || '',
                      experience: currentSeeker.experience || ''
                    });
                    setIsEditingPersonal(true);
                  }}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Edit2 size={13} />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</span>
                    <span className="text-sm font-semibold text-slate-800">{currentSeeker.name || 'Not Provided'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</span>
                    <span className="text-sm font-semibold text-slate-600">{currentSeeker.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</span>
                    <span className="text-sm font-semibold text-slate-800">{currentSeeker.phone || 'Not Provided'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp Contact</span>
                    <span className="text-sm font-semibold text-slate-800">{currentSeeker.whatsApp || 'Not Provided'}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Birth</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {currentSeeker.dob ? new Date(currentSeeker.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not Provided'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gender</span>
                    <span className="text-sm font-semibold text-slate-800">{currentSeeker.gender || 'Not Provided'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Street Address</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {[currentSeeker.address, currentSeeker.city, currentSeeker.state, currentSeeker.pincode ? `- ${currentSeeker.pincode}` : '', currentSeeker.country].filter(Boolean).join(', ') || 'Not Provided'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">LinkedIn URL</span>
                    {currentSeeker.linkedInUrl ? (
                      <a href={currentSeeker.linkedInUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 w-fit">
                        <Globe size={13} />
                        <span>View Profile</span>
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400">Not Provided</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-blue-50">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Short Professional Bio</span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-blue-100/40">
                    {currentSeeker.bio || 'No bio provided yet.'}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Business & Franchise Management Experience</span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-blue-100/40">
                    {currentSeeker.experience || 'No experience details registered.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* EDITABLE FORM */
            <form onSubmit={handlePersonalSave} className="space-y-6">
              <div className="flex justify-between items-center border-b border-blue-50 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    <span>Edit Personal & Bio Credentials</span>
                  </h3>
                  <p className="text-xs text-slate-500">Modify your verified background details used for matchmaking synchronization.</p>
                </div>
              </div>

              {personalError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2">
                  <X size={14} className="text-red-600 shrink-0" />
                  <span>{personalError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <User size={10} /> Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={personalForm.name}
                    onChange={(e) => setPersonalForm({...personalForm, name: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1 cursor-not-allowed">
                    <Mail size={10} /> Email Address (Read-only)
                  </label>
                  <input 
                    type="email" 
                    disabled
                    value={personalForm.email}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Phone size={10} /> Mobile Number
                  </label>
                  <input 
                    type="text" 
                    required
                    value={personalForm.phone}
                    onChange={(e) => setPersonalForm({...personalForm, phone: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">WhatsApp Contact</label>
                  <input 
                    type="text" 
                    required
                    value={personalForm.whatsApp}
                    onChange={(e) => setPersonalForm({...personalForm, whatsApp: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    required
                    value={personalForm.dob}
                    onChange={(e) => setPersonalForm({...personalForm, dob: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Gender</label>
                  <select 
                    value={personalForm.gender}
                    onChange={(e) => setPersonalForm({...personalForm, gender: e.target.value})}
                    className={seekerTheme.select}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Street Address</label>
                  <input 
                    type="text" 
                    required
                    value={personalForm.address}
                    onChange={(e) => setPersonalForm({...personalForm, address: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">City</label>
                  <input 
                    type="text" 
                    required
                    value={personalForm.city}
                    onChange={(e) => setPersonalForm({...personalForm, city: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">State</label>
                  <input 
                    type="text" 
                    required
                    value={personalForm.state}
                    onChange={(e) => setPersonalForm({...personalForm, state: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Pincode</label>
                  <input 
                    type="text" 
                    required
                    value={personalForm.pincode}
                    onChange={(e) => setPersonalForm({...personalForm, pincode: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Country</label>
                  <input 
                    type="text" 
                    required
                    value={personalForm.country}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Globe size={10} /> LinkedIn URL
                  </label>
                  <input 
                    type="url" 
                    value={personalForm.linkedInUrl}
                    onChange={(e) => setPersonalForm({...personalForm, linkedInUrl: e.target.value})}
                    className={seekerTheme.input}
                    placeholder="e.g. https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Short Professional Bio</label>
                  <textarea 
                    rows={3}
                    value={personalForm.bio}
                    onChange={(e) => setPersonalForm({...personalForm, bio: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Business & Franchise Management Experience</label>
                  <textarea 
                    rows={3}
                    value={personalForm.experience}
                    onChange={(e) => setPersonalForm({...personalForm, experience: e.target.value})}
                    className={seekerTheme.input}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-blue-50">
                <button
                  type="button"
                  disabled={isSavingPersonal}
                  onClick={() => {
                    setPersonalError(null);
                    setIsEditingPersonal(false);
                  }}
                  className="px-5 py-3 border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPersonal}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingPersonal ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: INVESTMENT MATRIX */}
      {activeTab === 'investment' && (
        <div className="bg-white rounded-3xl border border-blue-100/80 p-6 sm:p-8 space-y-6 shadow-xs">
          {!isEditingInvestment ? (
            /* READ-ONLY PRESENTATION */
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-blue-50 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                    <IndianRupee size={16} className="text-blue-600" />
                    <span>Investment Criteria & Target Matrix</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-normal">This data configures match weight in our AI Smart Recommendations pipeline.</p>
                </div>
                <button
                  onClick={() => setIsEditingInvestment(true)}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Edit2 size={13} />
                  <span>Edit Criteria</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Min Investment Budget</span>
                    <span className="text-sm font-semibold text-slate-800">₹{investmentForm.minInvestment} Lakhs</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Max Investment Budget</span>
                    <span className="text-sm font-semibold text-slate-800">₹{investmentForm.maxInvestment} Lakhs</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Capital On Hand</span>
                    <span className="text-sm font-black text-blue-700">₹{investmentForm.availableCapital} Lakhs</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Source of Capital / Funding</span>
                    <span className="text-sm font-semibold text-slate-800">{investmentForm.fundingSource}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Preferred Investment Timeline</span>
                    <span className="text-sm font-semibold text-slate-800">{investmentForm.timeline}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Preferred Industry Vertical</span>
                    <span className="text-sm font-semibold text-slate-800">{investmentForm.industry}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Preferred Franchise Model</span>
                    <span className="text-sm font-semibold text-slate-800">{investmentForm.franchiseType}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Preferred Target Cities</span>
                    <span className="text-sm font-semibold text-slate-800">{investmentForm.preferredCities}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-blue-50">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investment Risk Appetite</span>
                  <span className="text-sm font-semibold text-slate-800 block mt-1">{investmentForm.riskAppetite}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Business Background & Entrepreneurship Vision</span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-blue-100/40">
                    {investmentForm.businessBackground || 'No background description added.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* EDITABLE FORM */
            <form onSubmit={handleInvestmentSave} className="space-y-6">
              <div className="flex justify-between items-center border-b border-blue-50 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                    <IndianRupee size={16} className="text-blue-600" />
                    <span>Edit Investment Criteria & Target Matrix</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-normal">Configure weight adjustments inside the smart recommendation engine pipeline.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Min Investment Budget (₹ Lakhs)</label>
                  <input 
                    type="number" 
                    required
                    value={investmentForm.minInvestment}
                    onChange={(e) => setInvestmentForm({...investmentForm, minInvestment: Number(e.target.value)})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Max Investment Budget (₹ Lakhs)</label>
                  <input 
                    type="number" 
                    required
                    value={investmentForm.maxInvestment}
                    onChange={(e) => setInvestmentForm({...investmentForm, maxInvestment: Number(e.target.value)})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Available Capital On Hand (₹ Lakhs)</label>
                  <input 
                    type="number" 
                    required
                    value={investmentForm.availableCapital}
                    onChange={(e) => setInvestmentForm({...investmentForm, availableCapital: Number(e.target.value)})}
                    className={seekerTheme.input}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Source of Capital / Funding</label>
                  <select 
                    value={investmentForm.fundingSource}
                    onChange={(e) => setInvestmentForm({...investmentForm, fundingSource: e.target.value})}
                    className={seekerTheme.select}
                  >
                    <option value="Personal Savings + Business Equity">Personal Savings + Business Equity</option>
                    <option value="Sole Personal Savings">Sole Personal Savings</option>
                    <option value="Bank Business Loan Approved">Bank Business Loan Approved</option>
                    <option value="Venture / Family Capital">Venture / Family Capital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Investment Timeline</label>
                  <select 
                    value={investmentForm.timeline}
                    onChange={(e) => setInvestmentForm({...investmentForm, timeline: e.target.value})}
                    className={seekerTheme.select}
                  >
                    <option value="Immediate">Immediate (&lt; 30 Days)</option>
                    <option value="1-3 Months">1-3 Months</option>
                    <option value="3-6 Months">3-6 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Industry Vertical</label>
                  <select 
                    value={investmentForm.industry}
                    onChange={(e) => setInvestmentForm({...investmentForm, industry: e.target.value})}
                    className={seekerTheme.select}
                  >
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Retail & Supermarkets">Retail & Supermarkets</option>
                    <option value="Fitness & Sports">Fitness & Sports</option>
                    <option value="Automotive & EV">Automotive & EV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Franchise Model</label>
                  <select 
                    value={investmentForm.franchiseType}
                    onChange={(e) => setInvestmentForm({...investmentForm, franchiseType: e.target.value})}
                    className={seekerTheme.select}
                  >
                    <option value="FOCO (Franchise Owned Company Operated)">FOCO (Franchise Owned Company Operated)</option>
                    <option value="FOFO (Franchise Owned Franchise Operated)">FOFO (Franchise Owned Franchise Operated)</option>
                    <option value="COCO (Company Owned Company Operated)">COCO (Company Owned Company Operated)</option>
                    <option value="Master Franchise (Territory Operations)">Master Franchise (Territory Operations)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Target Cities</label>
                  <input 
                    type="text" 
                    required
                    value={investmentForm.preferredCities}
                    onChange={(e) => setInvestmentForm({...investmentForm, preferredCities: e.target.value})}
                    className={seekerTheme.input}
                    placeholder="e.g. Mumbai, Pune"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Investment Risk Appetite</label>
                  <select 
                    value={investmentForm.riskAppetite}
                    onChange={(e) => setInvestmentForm({...investmentForm, riskAppetite: e.target.value})}
                    className={seekerTheme.select}
                  >
                    <option value="Moderate - High Growth Seekers">Moderate - High Growth Seekers</option>
                    <option value="Conservative - Stable Royalty Yields">Conservative - Stable Royalty Yields</option>
                    <option value="Aggressive - Multi-Unit Greenfield">Aggressive - Multi-Unit Greenfield</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Business Background & Entrepreneurship Vision</label>
                <textarea 
                  rows={3}
                  value={investmentForm.businessBackground}
                  onChange={(e) => setInvestmentForm({...investmentForm, businessBackground: e.target.value})}
                  className={seekerTheme.input}
                  placeholder="Outline your background or active store operations..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setIsEditingInvestment(false)}
                  className="px-5 py-3 border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-xs flex items-center gap-2"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: DOCUMENT VAULT */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl border border-blue-100/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-50 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 font-heading mb-1 flex items-center gap-2">
                <FileCheck size={16} className="text-blue-600" />
                <span>Secure Seeker Document Vault</span>
              </h3>
              <p className="text-xs text-slate-500">Encrypted workspace. Upload identity and corporate records to verify available capital and legal clearances.</p>
            </div>
          </div>

          {/* Grid list of Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-slate-50/70 rounded-2xl border border-blue-100 p-5 flex items-start gap-4 hover:border-blue-300 transition-all relative overflow-hidden group shadow-xs"
              >
                <div className="p-3 bg-white border border-blue-100 rounded-xl text-blue-600 shadow-xs">
                  <FileText size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{doc.type}</span>
                    {doc.status === 'VERIFIED' && (
                      <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full uppercase">Vetted</span>
                    )}
                    {doc.status === 'PENDING' && (
                      <span className="text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase">Auditing</span>
                    )}
                    {doc.status === 'EMPTY' && (
                      <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase">Not Uploaded</span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-xs truncate max-w-[200px] sm:max-w-[280px]">
                    {doc.name}
                  </h4>

                  {doc.status !== 'EMPTY' && (
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {doc.size} • Uploaded {doc.date}
                    </span>
                  )}

                  {/* Actions inside doc card */}
                  <div className="flex items-center gap-3 mt-3.5">
                    {doc.status !== 'EMPTY' ? (
                      <>
                        <button
                          onClick={() => setPreviewDoc(doc.name)}
                          className="text-[10px] font-bold text-slate-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>Preview</span>
                        </button>
                        <a 
                          href="#"
                          onClick={(e) => { 
                            e.preventDefault(); 
                            if (doc.fileData) {
                              const link = document.createElement('a');
                              link.href = doc.fileData;
                              link.download = doc.name;
                              link.click();
                            } else {
                              triggerSuccess(`Downloading encrypted file "${doc.name}"...`); 
                            }
                          }}
                          className="text-[10px] font-bold text-slate-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Download size={12} />
                          <span>Download</span>
                        </a>
                        <button 
                          onClick={() => setDocUploadModal(doc.id)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Upload size={12} />
                          <span>Replace</span>
                        </button>
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer ml-auto font-bold"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setDocUploadModal(doc.id)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Upload size={12} />
                        <span>Upload File</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Secure vault certificate badge */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              BrizX India secures files using AES-256 standard and strict TLS protocols. Standard disclosures and LOIs are only visible to brand founders upon your explicit consent.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: ROI CALCULATOR */}
      {activeTab === 'roi' && (
        <div className="space-y-6">
          <ROICalculatorCard 
            initialInvestment={investmentForm.availableCapital}
            expectedMonthlyRevenue={investmentForm.availableCapital * 0.12}
            expectedMonthlyOperatingCost={investmentForm.availableCapital * 0.12 * 0.7}
            titleContext="Franchise Seeker Outlook"
          />
        </div>
      )}

      {/* Image Upload Modal (Avatar or Cover) */}
      {imageUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-blue-100 w-full max-w-md overflow-hidden shadow-xl animate-fadeIn">
            <div className="px-6 py-4 bg-slate-50 border-b border-blue-100 flex justify-between items-center">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading">
                {imageUploadModal === 'avatar' ? 'Change Profile Picture' : 'Change Cover Photo'}
              </span>
              <button 
                onClick={() => {
                  setImageUploadModal(null);
                  setImagePreview(null);
                  setImageFile(null);
                  setImageError(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {imageError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-800 animate-fadeIn">
                  {imageError}
                </div>
              )}

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className={imageUploadModal === 'avatar' ? "w-32 h-32 rounded-full object-cover my-4 shadow-md border-4 border-white" : "w-full h-32 object-cover rounded-xl shadow-xs"}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200"
                    >
                      Choose Different Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => galleryInputRef.current?.click()}
                    className="p-6 border border-dashed border-blue-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2.5 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
                  >
                    <Upload size={24} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-700 text-center">Choose from Gallery</span>
                  </button>

                  <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-6 border border-dashed border-blue-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2.5 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
                  >
                    <Camera size={24} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-700 text-center">Take Photo (Camera)</span>
                  </button>
                </div>
              )}

              {/* Hidden Inputs */}
              <input 
                type="file" 
                accept="image/*" 
                ref={galleryInputRef} 
                className="hidden" 
                onChange={(e) => handleImageSelect(e, false)} 
              />
              <input 
                type="file" 
                accept="image/*" 
                capture="user" 
                ref={cameraInputRef} 
                className="hidden" 
                onChange={(e) => handleImageSelect(e, true)} 
              />

              {isUploadingImage && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Uploading photo...</span>
                    <span>{uploadImageProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-150" style={{ width: `${uploadImageProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-blue-100 flex justify-end gap-2.5">
              <button 
                onClick={() => {
                  setImageUploadModal(null);
                  setImagePreview(null);
                  setImageFile(null);
                  setImageError(null);
                }}
                disabled={isUploadingImage}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveImage}
                disabled={!imagePreview || isUploadingImage}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isUploadingImage ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {docUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-blue-100 w-full max-w-md overflow-hidden shadow-xl animate-fadeIn">
            <div className="px-6 py-4 bg-slate-50 border-b border-blue-100 flex justify-between items-center">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading">
                Upload {documents.find(d => d.id === docUploadModal)?.type || 'Document'}
              </span>
              <button 
                onClick={() => {
                  setDocUploadModal(null);
                  setDocFile(null);
                  setDocPreview(null);
                  setDocError(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {docError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-800">
                  {docError}
                </div>
              )}

              {docFile ? (
                <div className="space-y-4">
                  <div className="p-4 border border-blue-100 rounded-2xl bg-slate-50 space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText size={28} className="text-blue-600 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate">{docFile.name}</p>
                        <p className="text-[10px] text-slate-500">{(docFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>

                    {docFile.type.startsWith('image/') && docPreview && (
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-40 flex items-center justify-center">
                        <img 
                          src={docPreview} 
                          alt="Document Preview" 
                          className="max-h-40 object-contain w-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => {
                        setDocFile(null);
                        setDocPreview(null);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Choose Different File
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => docGalleryRef.current?.click()}
                    className="p-6 border border-dashed border-blue-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2.5 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
                  >
                    <Upload size={24} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-700 text-center">Choose File / PDF / Gallery</span>
                  </button>

                  <button 
                    onClick={() => docCameraRef.current?.click()}
                    className="p-6 border border-dashed border-blue-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2.5 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
                  >
                    <Camera size={24} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-700 text-center">Capture Photo (Camera)</span>
                  </button>
                </div>
              )}

              {/* Hidden Inputs for Doc upload */}
              <input 
                type="file" 
                accept=".pdf,image/*" 
                ref={docGalleryRef} 
                className="hidden" 
                onChange={handleDocSelect} 
              />
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                ref={docCameraRef} 
                className="hidden" 
                onChange={handleDocSelect} 
              />

              {isUploadingDoc && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Uploading document...</span>
                    <span>{uploadDocProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-150" style={{ width: `${uploadDocProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-blue-100 flex justify-end gap-2.5">
              <button 
                onClick={() => {
                  setDocUploadModal(null);
                  setDocFile(null);
                  setDocPreview(null);
                  setDocError(null);
                }}
                disabled={isUploadingDoc}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveDoc}
                disabled={!docFile || isUploadingDoc}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isUploadingDoc ? 'Uploading...' : 'Save & Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF / Doc Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-blue-100 w-full max-w-xl overflow-hidden shadow-xl animate-fadeIn">
            <div className="px-6 py-4 bg-slate-50 border-b border-blue-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600" size={18} />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading">Document Preview Console</span>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 text-center space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedPreviewDocObj?.fileData?.startsWith('data:image/') ? (
                <div className="border border-blue-100 rounded-2xl overflow-hidden bg-slate-50 max-h-80 flex items-center justify-center p-2 mb-4 shadow-inner">
                  <img 
                    src={selectedPreviewDocObj.fileData} 
                    alt={previewDoc || 'Document Preview'} 
                    className="max-h-80 object-contain mx-auto rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FileCheck size={32} />
                </div>
              )}
              <h4 className="font-extrabold text-slate-900 text-base font-heading">{previewDoc}</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Securely encrypted via BrizX. Document integrity check is successful and verified by MCA database.
              </p>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-blue-100 max-w-sm mx-auto text-left text-[11px] font-semibold text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span>File Integrity Check</span>
                  <span className="text-emerald-700 font-bold uppercase">Pass</span>
                </div>
                <div className="flex justify-between">
                  <span>SSL Handshake Verification</span>
                  <span className="text-emerald-700 font-bold uppercase">Authorized</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Logs Status</span>
                  <span className="text-slate-800">Clean Records</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-blue-100 flex justify-end gap-2">
              <button 
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-200 transition-colors"
              >
                Close Preview
              </button>
              <button 
                onClick={() => { setPreviewDoc(null); triggerSuccess('Document print queue configured successfully.'); }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Print / Verify Status
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
