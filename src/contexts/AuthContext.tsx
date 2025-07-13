
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
      
      // The auth state change handler will load the profile
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
      
      // Always try to save to Firestore first
      try {
        await setDoc(doc(db, 'users', result.user.uid), userProfile);
        console.log('User profile saved to Firestore with role:', role);
        setUserProfile(userProfile);
      } catch (firestoreError) {
        console.log('Firestore save failed, using local storage:', firestoreError);
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

  const loadUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      console.log(`Loading profile for user: ${user.uid}`);
      
      // First try to get from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const profileData = userDoc.data() as UserProfile;
        console.log('Profile loaded from Firestore:', profileData);
        return profileData;
      }
      
      // Try localStorage as fallback
      const localProfile = localStorage.getItem(`user_profile_${user.uid}`);
      if (localProfile) {
        const profileData = JSON.parse(localProfile) as UserProfile;
        console.log('Profile loaded from localStorage:', profileData);
        return profileData;
      }
      
      console.log('No existing profile found, this should only happen for very old accounts');
      return null;
      
    } catch (error) {
      console.log('Error loading profile from Firestore, trying localStorage:', error);
      
      // Try localStorage backup
      const localProfile = localStorage.getItem(`user_profile_${user.uid}`);
      if (localProfile) {
        const profileData = JSON.parse(localProfile) as UserProfile;
        console.log('Profile loaded from localStorage backup:', profileData);
        return profileData;
      }
      
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.uid || 'logged out');
      setCurrentUser(user);
      
      if (user) {
        const profile = await loadUserProfile(user);
        
        if (profile) {
          setUserProfile(profile);
          console.log(`User logged in with role: ${profile.role}`);
        } else {
          // Only create default profile if absolutely no data exists
          // This should rarely happen for new registrations
          const defaultProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || 'User',
            phoneNumber: user.phoneNumber || undefined,
            role: 'user', // Default to user role
            createdAt: new Date()
          };
          
          console.log('Created temporary default profile - consider re-registering for proper role assignment');
          setUserProfile(defaultProfile);
          
          // Try to save this default profile for future use
          try {
            await setDoc(doc(db, 'users', user.uid), defaultProfile);
            localStorage.setItem(`user_profile_${user.uid}`, JSON.stringify(defaultProfile));
          } catch (error) {
            console.log('Could not save default profile:', error);
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
