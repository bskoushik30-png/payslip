import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AuthState } from '../types/auth';
import { getSupabase } from '../services/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
}

const STORAGE_KEY_AUTH = 'zenith_auth_session';

const DEMO_ADMIN: AdminUser = {
  id: 'admin-001',
  email: 'admin@company.com',
  name: 'Administrator',
  role: 'superadmin',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial auth state
    const initAuth = async () => {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || 'admin@company.com',
              name: data.session.user.user_metadata?.full_name || 'System Admin',
              role: 'admin',
            });
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Error checking supabase session:', err);
        }
      }

      // Check local storage session
      try {
        const stored = localStorage.getItem(STORAGE_KEY_AUTH);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Error reading stored auth session:', err);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // If Supabase credentials failed, allow fallback if matching demo credentials or prompt error
          if ((email === 'admin@company.com' || email === 'admin@apexzenith.com') && password.length >= 4) {
            setUser(DEMO_ADMIN);
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(DEMO_ADMIN));
            setIsLoading(false);
            return { success: true };
          }
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const authUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.full_name || 'Admin',
            role: 'admin',
          };
          setUser(authUser);
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authUser));
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase auth exception:', err);
      }
    }

    // Local admin verification
    if (email && password) {
      if (password.length >= 4) {
        const namePart = email.split('@')[0].replace('.', ' ');
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const authUser: AdminUser = {
          id: 'admin-' + Date.now().toString(36),
          email,
          name: formattedName || 'System Administrator',
          role: 'admin',
        };
        setUser(authUser);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authUser));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'Password must be at least 4 characters long.' };
      }
    }

    setIsLoading(false);
    return { success: false, error: 'Please provide both email and password.' };
  };

  const loginAsDemo = () => {
    setUser(DEMO_ADMIN);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(DEMO_ADMIN));
  };

  const logout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase logout error:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
