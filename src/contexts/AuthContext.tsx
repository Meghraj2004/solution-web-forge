
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
      
      // Try to get user profile, but don't fail if Firestore rules aren't set up
      try {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          // Create a default profile if none exists
          const defaultProfile: UserProfile = {
            uid: result.user.uid,
            email: result.user.email!,
            displayName: result.user.displayName || 'User',
            role: 'user',
            createdAt: new Date()
          };
          setUserProfile(defaultProfile);
        }
      } catch (firestoreError) {
        console.log('Firestore permission error, using default profile:', firestoreError);
        // Create a temporary profile for the session
        const tempProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'User',
          role: 'user',
          createdAt: new Date()
        };
        setUserProfile(tempProfile);
      }
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
        role,
        createdAt: new Date()
      };
      
      // Try to save to Firestore, but don't fail if permissions aren't set up
      try {
        await setDoc(doc(db, 'users', result.user.uid), userProfile);
        console.log('User profile saved to Firestore');
      } catch (firestoreError) {
        console.log('Firestore permission error, profile not saved:', firestoreError);
      }
      
      setUserProfile(userProfile);
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
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // Create default profile if none exists
            const defaultProfile: UserProfile = {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || 'User',
              role: 'user',
              createdAt: new Date()
            };
            setUserProfile(defaultProfile);
          }
        } catch (firestoreError) {
          console.log('Firestore permission error, using temporary profile:', firestoreError);
          // Use temporary profile
          const tempProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || 'User',
            role: 'user',
            createdAt: new Date()
          };
          setUserProfile(tempProfile);
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
