import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, RegisterPayload } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isBackendOnline: boolean;
  pendingEmail: string | null;
  pendingName: string | null;
  lastReceivedOtp: string | null;
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; otp?: string; message: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; message: string }>;
  resendOtp: () => Promise<{ success: boolean; otp?: string; message: string }>;
  loginQuick: (email: string, name?: string) => void;
  logout: () => void;
  resetPendingState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'cloudvault_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pendingEmail, setPendingEmail] = useState<string | null>(() => {
    return sessionStorage.getItem('pending_email');
  });
  const [pendingName, setPendingName] = useState<string | null>(() => {
    return sessionStorage.getItem('pending_name');
  });
  const [lastReceivedOtp, setLastReceivedOtp] = useState<string | null>(() => {
    return sessionStorage.getItem('pending_otp');
  });
  const [cachedPassword, setCachedPassword] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  // Check backend health periodically
  useEffect(() => {
    const check = async () => {
      const alive = await authApi.checkHealth();
      setIsBackendOnline(alive);
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const clearError = () => setError(null);

  const register = async (payload: RegisterPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await authApi.register(payload);
      setPendingEmail(payload.email);
      setPendingName(payload.name);
      setCachedPassword(payload.password);
      if (res.otp) {
        setLastReceivedOtp(res.otp);
        sessionStorage.setItem('pending_otp', res.otp);
      }
      sessionStorage.setItem('pending_email', payload.email);
      sessionStorage.setItem('pending_name', payload.name);

      return {
        success: true,
        otp: res.otp,
        message: res.message || 'OTP sent successfully',
      };
    } catch (err: any) {
      const msg = err.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    if (!pendingEmail) {
      setError('No active verification session found. Please register first.');
      return { success: false, message: 'No email to verify' };
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await authApi.verifyOtp({ email: pendingEmail, otp });

      const verifiedUser: User = {
        name: pendingName || pendingEmail.split('@')[0],
        email: pendingEmail,
        is_verified: true,
        status: 'Active',
      };

      setUser(verifiedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedUser));

      // Clean pending state
      setPendingEmail(null);
      setPendingName(null);
      setLastReceivedOtp(null);
      setCachedPassword(null);
      sessionStorage.removeItem('pending_email');
      sessionStorage.removeItem('pending_name');
      sessionStorage.removeItem('pending_otp');

      return {
        success: true,
        message: res.message || 'Account verified successfully!',
      };
    } catch (err: any) {
      const msg = err.message || 'OTP verification failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (!pendingEmail) {
      return { success: false, message: 'No email found' };
    }
    // If we have cached password or re-issue
    if (cachedPassword && pendingName) {
      return register({
        name: pendingName,
        email: pendingEmail,
        password: cachedPassword,
      });
    }
    return {
      success: false,
      message: 'To resend OTP, please submit the registration form again.',
    };
  };

  const loginQuick = (email: string, name?: string) => {
    const loggedUser: User = {
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      is_verified: true,
      status: 'Active',
    };
    setUser(loggedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resetPendingState = () => {
    setPendingEmail(null);
    setPendingName(null);
    setLastReceivedOtp(null);
    setCachedPassword(null);
    sessionStorage.removeItem('pending_email');
    sessionStorage.removeItem('pending_name');
    sessionStorage.removeItem('pending_otp');
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isBackendOnline,
        pendingEmail,
        pendingName,
        lastReceivedOtp,
        isSubmitting,
        error,
        clearError,
        register,
        verifyOtp,
        resendOtp,
        loginQuick,
        logout,
        resetPendingState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
