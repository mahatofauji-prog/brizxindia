import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, FranchiseSeeker } from '../types';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { mockSeekers, mockBrands } from '../data/mockDb';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role: Role, seekerPayload?: Partial<FranchiseSeeker>) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (updatedFields: Partial<User>) => void;
  fetchSeekerProfile: (userId: string) => Promise<FranchiseSeeker | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cachedUserData = localStorage.getItem('brizx_user_data');
    if (cachedUserData) {
      try {
        const parsed = JSON.parse(cachedUserData);
        if (parsed && parsed.id) {
          setUser(parsed);
        }
      } catch (e) {}
    }

    const savedUserId = localStorage.getItem('brizx_user_id');
    if (savedUserId) {
      const fetchFromFirestore = async () => {
        try {
          const seekerRef = doc(db, 'seekers', savedUserId);
          const seekerSnap = await getDoc(seekerRef);
          if (seekerSnap.exists()) {
            const data = { id: seekerSnap.id, ...seekerSnap.data() } as User;
            setUser(data);
            localStorage.setItem('brizx_user_data', JSON.stringify(data));
            setLoading(false);
            return;
          }

          const userRef = doc(db, 'users', savedUserId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = { id: userSnap.id, ...userSnap.data() } as User;
            setUser(data);
            localStorage.setItem('brizx_user_data', JSON.stringify(data));
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Error fetching user from firestore:', e);
        } finally {
          setLoading(false);
        }
      };
      fetchFromFirestore();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSeekerProfile = async (userId: string): Promise<FranchiseSeeker | null> => {
    if (!userId) return null;
    try {
      const seekerRef = doc(db, 'seekers', userId);
      const seekerSnap = await getDoc(seekerRef);
      if (seekerSnap.exists()) {
        return { id: seekerSnap.id, ...seekerSnap.data() } as FranchiseSeeker;
      }
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as FranchiseSeeker;
      }
    } catch (err) {
      console.warn('Error fetching seeker profile from Firestore:', err);
    }
    return null;
  };

  const login = async (email: string, role: Role, seekerPayload?: Partial<FranchiseSeeker>): Promise<User | null> => {
    let targetUser: User | null = null;
    const cleanEmail = email.trim().toLowerCase();

    if (role === 'SUPER_ADMIN') {
      targetUser = {
        id: 'admin1',
        name: 'Super Admin',
        email: 'admin@brizx.in',
        role: 'SUPER_ADMIN',
        verified: true,
        createdAt: new Date().toISOString()
      };
    } else if (role === 'BRAND_OWNER') {
      // 1. First, check Firestore for existing brand document by email
      try {
        const brandsRef = collection(db, 'brands');
        const q = query(brandsRef, where('email', '==', cleanEmail));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const docSnap = querySnap.docs[0];
          targetUser = { id: docSnap.id, ...docSnap.data() } as User;
        }
      } catch (e) {
        console.warn('Firestore lookup error for brand email:', e);
      }

      // 2. If not found in Firestore, search localStorage
      if (!targetUser) {
        const storedBrandsRaw = localStorage.getItem('brizx_brands');
        let allBrands = storedBrandsRaw ? JSON.parse(storedBrandsRaw) : mockBrands;
        const existingBrand = allBrands.find(b => b.email.toLowerCase() === cleanEmail);

        if (existingBrand) {
          targetUser = existingBrand;
        }
      }

      // 3. Sync targetUser back into localStorage to keep it up-to-date
      if (targetUser) {
        const storedBrandsRaw = localStorage.getItem('brizx_brands');
        let allBrands = storedBrandsRaw ? JSON.parse(storedBrandsRaw) : [];
        const existingIndex = allBrands.findIndex((b: any) => b.id === targetUser!.id || b.email.toLowerCase() === cleanEmail);
        if (existingIndex !== -1) {
          allBrands[existingIndex] = { ...allBrands[existingIndex], ...targetUser };
        } else {
          allBrands.unshift(targetUser);
        }
        localStorage.setItem('brizx_brands', JSON.stringify(allBrands));
      } else {
        const newBrandId = `brand_${Date.now()}`;
        targetUser = {
          id: newBrandId,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'BRAND_OWNER',
          verified: true,
          createdAt: new Date().toISOString()
        } as User;

        const newBrand = {
          id: newBrandId,
          ownerId: newBrandId,
          brandName: cleanEmail.split('@')[0],
          email: cleanEmail,
          logo: '',
          industry: 'Other',
          investmentRequired: { min: 5, max: 20 },
          cityTargets: [],
          description: '',
          establishedYear: new Date().getFullYear().toString(),
          spaceRequired: '100-500 Sq.Ft.',
          verified: false,
          activeOutlets: '0',
          royaltyFee: '0%',
          savedLeads: [],
          unlockedLeads: [],
          createdAt: new Date().toISOString(),
          brandOrigin: 'new_registration',
          applicationStatus: 'PENDING_REVIEW' as const
        };
        const storedBrandsRaw = localStorage.getItem('brizx_brands');
        let allBrands = storedBrandsRaw ? JSON.parse(storedBrandsRaw) : [];
        allBrands.unshift(newBrand);
        localStorage.setItem('brizx_brands', JSON.stringify(allBrands));
      }
    } else {
      // FRANCHISE_SEEKER
      // 1. First, check Firestore for existing seeker document by email
      try {
        const seekersRef = collection(db, 'seekers');
        const q = query(seekersRef, where('email', '==', cleanEmail));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const docSnap = querySnap.docs[0];
          targetUser = { id: docSnap.id, ...docSnap.data() } as User;
        }
      } catch (e) {
        console.warn('Firestore lookup error for seeker email:', e);
      }

      // 2. If not found in Firestore, search localStorage
      if (!targetUser) {
        const storedSeekersRaw = localStorage.getItem('brizx_seekers');
        let allSeekers: FranchiseSeeker[] = storedSeekersRaw ? JSON.parse(storedSeekersRaw) : [];
        let existingSeeker = allSeekers.find(s => s.email?.toLowerCase() === cleanEmail);

        if (existingSeeker) {
          targetUser = {
            ...existingSeeker,
            ...(seekerPayload || {})
          } as User;
        }
      }

      // 3. If still not found, construct clean brand-new Franchise Seeker user
      if (!targetUser) {
        const newId = `seeker_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        
        let minInv = 15;
        let maxInv = 35;
        let invVal = 25;
        if (seekerPayload?.investment) {
          invVal = Number(seekerPayload.investment);
          minInv = Math.max(5, invVal - 10);
          maxInv = invVal + 15;
        }

        const newSeeker: FranchiseSeeker = {
          id: newId,
          name: seekerPayload?.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'FRANCHISE_SEEKER',
          phone: seekerPayload?.phone || '',
          whatsApp: seekerPayload?.whatsApp || seekerPayload?.phone || '',
          city: seekerPayload?.city || '',
          state: seekerPayload?.state || '',
          country: seekerPayload?.country || 'India',
          investment: invVal,
          minInvestment: minInv,
          maxInvestment: maxInv,
          availableCapital: invVal,
          fundingSource: seekerPayload?.fundingSource || 'Personal Savings',
          timeline: seekerPayload?.timeline || 'Immediate',
          industry: seekerPayload?.industry || 'Food & Beverages',
          franchiseType: seekerPayload?.franchiseType || 'FOCO (Franchise Owned Company Operated)',
          businessBackground: seekerPayload?.businessBackground || '',
          experience: seekerPayload?.experience || '',
          linkedInUrl: seekerPayload?.linkedInUrl || '',
          bio: seekerPayload?.bio || '',
          verified: false,
          isPremium: false,
          documents: seekerPayload?.documents || [],
          savedBrandIds: [],
          preferredCities: seekerPayload?.preferredCities || (seekerPayload?.city ? [seekerPayload.city] : []),
          preferredIndustries: seekerPayload?.preferredIndustries || (seekerPayload?.industry ? [seekerPayload.industry] : []),
          applicationStatus: seekerPayload?.applicationStatus || 'DRAFT',
          completionPercentage: seekerPayload?.completionPercentage || 30,
          createdAt: new Date().toISOString()
        };

        targetUser = newSeeker as User;

        const storedSeekersRaw = localStorage.getItem('brizx_seekers');
        let allSeekers: FranchiseSeeker[] = storedSeekersRaw ? JSON.parse(storedSeekersRaw) : [];
        allSeekers.unshift(newSeeker);
        localStorage.setItem('brizx_seekers', JSON.stringify(allSeekers));
      } else if (seekerPayload && Object.keys(seekerPayload).length > 0) {
        targetUser = { ...targetUser, ...seekerPayload };
      }

      // Sync to Firestore
      try {
        const seekerRef = doc(db, 'seekers', targetUser.id);
        await setDoc(seekerRef, targetUser, { merge: true });
        const userRef = doc(db, 'users', targetUser.id);
        await setDoc(userRef, targetUser, { merge: true });
      } catch (e) {
        console.warn('Firestore setDoc warning:', e);
      }
    }

    if (targetUser) {
      setUser(targetUser);
      localStorage.setItem('brizx_user_id', targetUser.id);
      localStorage.setItem('brizx_user_data', JSON.stringify(targetUser));
    }
    return targetUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('brizx_user_id');
    localStorage.removeItem('brizx_user_data');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    try {
      localStorage.setItem('brizx_user_data', JSON.stringify(updated));
    } catch (e) {}

    if (user.role === 'FRANCHISE_SEEKER') {
      try {
        const storedSeekersRaw = localStorage.getItem('brizx_seekers');
        let seekersArr: FranchiseSeeker[] = storedSeekersRaw ? JSON.parse(storedSeekersRaw) : [];
        const idx = seekersArr.findIndex(s => s.id === user.id);
        if (idx !== -1) {
          seekersArr[idx] = { ...seekersArr[idx], ...updatedFields, role: 'FRANCHISE_SEEKER' } as FranchiseSeeker;
        } else {
          seekersArr.unshift({ ...updated, role: 'FRANCHISE_SEEKER' } as FranchiseSeeker);
        }
        localStorage.setItem('brizx_seekers', JSON.stringify(seekersArr));
      } catch (e) {}
    }

    try {
      const seekerRef = doc(db, 'seekers', user.id);
      setDoc(seekerRef, updatedFields, { merge: true }).catch(() => {});
      const userRef = doc(db, 'users', user.id);
      setDoc(userRef, updatedFields, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user, updateUser, fetchSeekerProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

