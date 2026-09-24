
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Permission, ROLE_PERMISSIONS } from '../types/auth';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  googleAccessToken: string | null;
  setGoogleAccessToken: (token: string | null) => void;
  login: () => Promise<void>;
  connectGmail: () => Promise<string>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, fullName: string, role?: UserRole, country?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          // Sync with Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            // Initialize new user
            const newUser: User = {
              uid: firebaseUser.uid,
              fullName: firebaseUser.displayName || 'Unnamed User',
              username: firebaseUser.email?.split('@')[0] || firebaseUser.uid.substring(0, 8),
              email: firebaseUser.email || '',
              role: firebaseUser.email === 'dtemitope60@gmail.com' ? 'Super Admin' : 'Missionary',
              country: 'Global'
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.warn("Firestore user sync fallback: ", error);
          // Fallback user state so the application can still render successfully
          setUser({
            uid: firebaseUser.uid,
            fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unnamed User',
            username: firebaseUser.email?.split('@')[0] || firebaseUser.uid.substring(0, 8),
            email: firebaseUser.email || '',
            role: firebaseUser.email === 'dtemitope60@gmail.com' ? 'Super Admin' : 'Missionary',
            country: 'Global'
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    provider.addScope('https://www.googleapis.com/auth/gmail.send');
    provider.addScope('https://www.googleapis.com/auth/gmail.modify');
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      setGoogleAccessToken(credential.accessToken);
    }
  };

  const connectGmail = async (): Promise<string> => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    provider.addScope('https://www.googleapis.com/auth/gmail.send');
    provider.addScope('https://www.googleapis.com/auth/gmail.modify');
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token');
    }
    setGoogleAccessToken(credential.accessToken);
    return credential.accessToken;
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    fullName: string, 
    role: UserRole = 'Missionary', 
    country: string = 'Global'
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (fullName && userCredential.user) {
      try {
        await updateProfile(userCredential.user, { displayName: fullName });
      } catch (e) {
        console.warn("Failed to set displayName on auth user:", e);
      }
    }
    const newUser: User = {
      uid: userCredential.user.uid,
      fullName: fullName || email.split('@')[0],
      username: email.split('@')[0] || userCredential.user.uid.substring(0, 8),
      email: email,
      role: email === 'dtemitope60@gmail.com' ? 'Super Admin' : role,
      country: country || 'Global'
    };
    try {
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, newUser);
    } catch (e) {
      console.warn("Firestore user creation fallback:", e);
    }
    setUser(newUser);
  };

  const logout = async () => {
    await signOut(auth);
    setGoogleAccessToken(null);
  };

  const hasPermission = React.useCallback((permission: Permission): boolean => {
    if (!user || !user.role || !ROLE_PERMISSIONS[user.role]) return false;
    return ROLE_PERMISSIONS[user.role].includes(permission);
  }, [user]);

  const hasRole = React.useCallback((roles: UserRole[]): boolean => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      googleAccessToken, 
      setGoogleAccessToken, 
      login, 
      connectGmail, 
      loginWithEmail, 
      signUpWithEmail,
      logout, 
      hasPermission, 
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
