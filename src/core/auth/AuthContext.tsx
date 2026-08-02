import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { AuthService, UserProfileData } from '../../services/authService';
import { UserRole } from '../../types/saas';

export interface UserProfile extends UserProfileData {}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  error: null,
  role: 'super_admin',
  setRole: () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ababil_logged_in');
      const savedProfile = localStorage.getItem('ababil_user_profile');
      if (saved === 'true' && savedProfile) {
        const prof = JSON.parse(savedProfile);
        return { uid: prof.uid, email: prof.email } as User;
      }
    } catch {}
    return null;
  });

  const [role, setRole] = useState<UserRole>(() => {
    try {
      const savedProfile = localStorage.getItem('ababil_user_profile');
      if (savedProfile) {
        const prof = JSON.parse(savedProfile);
        return prof.role || 'super_admin';
      }
    } catch {}
    return 'super_admin';
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const savedProfile = localStorage.getItem('ababil_user_profile');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
    } catch {}
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const profile = await AuthService.getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          setRole(profile.role);
          localStorage.setItem('ababil_logged_in', 'true');
          localStorage.setItem('ababil_user_profile', JSON.stringify(profile));
        } else {
          const defaultProf: UserProfile = {
            uid: user.uid,
            email: user.email || 'user@garage.com',
            displayName: user.displayName || 'Enterprise User',
            role: role,
            tenantId: 'org_bismillah_001',
            status: 'active',
          };
          setUserProfile(defaultProf);
          localStorage.setItem('ababil_logged_in', 'true');
          localStorage.setItem('ababil_user_profile', JSON.stringify(defaultProf));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]);

  const login = async (email: string, pass: string, rememberMe: boolean = true) => {
    setLoading(true);
    setError(null);
    try {
      const { user, profile } = await AuthService.login(email, pass, rememberMe);
      setCurrentUser(user);
      setUserProfile(profile);
      setRole(profile.role);
      localStorage.setItem('ababil_logged_in', 'true');
      localStorage.setItem('ababil_user_profile', JSON.stringify(profile));
    } catch (err: any) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে।');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      localStorage.removeItem('ababil_logged_in');
      localStorage.removeItem('ababil_user_profile');
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err: any) {
      console.warn('Logout error:', err);
      localStorage.removeItem('ababil_logged_in');
      localStorage.removeItem('ababil_user_profile');
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userProfile, 
      loading, 
      error, 
      role, 
      setRole, 
      login, 
      logout, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
