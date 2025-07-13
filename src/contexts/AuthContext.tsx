
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role: 'admin' | 'user') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', result.user.uid);
      
      // Wait for the auth state change to handle profile loading
      // Don't set profile here to avoid race conditions
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string, role: 'admin' | 'user') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName,
        phoneNumber: result.user.phoneNumber || undefined,
        role,
        createdAt: new Date()
      };
      
      // Try to save to Firestore
      try {
        await setDoc(doc(db, 'users', result.user.uid), userProfile);
        console.log('User profile saved to Firestore');
        setUserProfile(userProfile);
      } catch (firestoreError) {
        console.log('Firestore permission error, using local profile:', firestoreError);
        // Store in localStorage as backup
        localStorage.setItem(`user_profile_${result.user.uid}`, JSON.stringify(userProfile));
        setUserProfile(userProfile);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.uid);
      setCurrentUser(user);
      
      if (user) {
        try {
          // First try to get from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data() as UserProfile;
            console.log('Profile loaded from Firestore:', profileData.role);
            setUserProfile(profileData);
          } else {
            // Try to get from localStorage as backup
            const localProfile = localStorage.getItem(`user_profile_${user.uid}`);
            if (localProfile) {
              const profileData = JSON.parse(localProfile) as UserProfile;
              console.log('Profile loaded from localStorage:', profileData.role);
              setUserProfile(profileData);
            } else {
              // Create default profile only if no data exists anywhere
              const defaultProfile: UserProfile = {
                uid: user.uid,
                email: user.email!,
                displayName: user.displayName || 'User',
                phoneNumber: user.phoneNumber || undefined,
                role: 'user',
                createdAt: new Date()
              };
              console.log('Created default profile');
              setUserProfile(defaultProfile);
            }
          }
        } catch (firestoreError) {
          console.log('Firestore permission error, trying localStorage:', firestoreError);
          // Try localStorage backup
          const localProfile = localStorage.getItem(`user_profile_${user.uid}`);
          if (localProfile) {
            const profileData = JSON.parse(localProfile) as UserProfile;
            console.log('Profile loaded from localStorage backup:', profileData.role);
            setUserProfile(profileData);
          } else {
            // Last resort: temporary profile
            const tempProfile: UserProfile = {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || 'User',
              phoneNumber: user.phoneNumber || undefined,
              role: 'user',
              createdAt: new Date()
            };
            console.log('Using temporary profile');
            setUserProfile(tempProfile);
          }
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
