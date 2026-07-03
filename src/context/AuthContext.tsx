/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiGet, apiPost } from '../lib/api-client';
import { type Profile, type UserRole } from '../types';

const AUTH_TOKEN_STORAGE_KEY = 'cacao-auth-token';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  session: { token: string } | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const persistSession = (token: string, authUser: AuthUser, profileData: Profile | null) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      window.localStorage.setItem('cacao-auth-user', JSON.stringify(authUser));
      if (profileData) {
        window.localStorage.setItem('cacao-auth-profile', JSON.stringify(profileData));
      }
    }
    setSession({ token });
    setUser(authUser);
    setProfile(profileData);
  };

  const restoreSession = async () => {
    if (typeof window === 'undefined') return;

    const storedToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const storedUser = window.localStorage.getItem('cacao-auth-user');
    const storedProfile = window.localStorage.getItem('cacao-auth-profile');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser) as AuthUser;
      const parsedProfile = storedProfile ? (JSON.parse(storedProfile) as Profile) : null;
      setSession({ token: storedToken });
      setUser(parsedUser);
      setProfile(parsedProfile);

      if (!parsedProfile) {
        try {
          const freshProfile = await apiGet<Profile>('/api/users/me');
          setProfile(freshProfile);
          window.localStorage.setItem('cacao-auth-profile', JSON.stringify(freshProfile));
        } catch {
          // Ignore profile refresh failure; user state is still usable.
        }
      }
    }
  };

  useEffect(() => {
    restoreSession().finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const data = await apiPost<{ token: string; user: AuthUser; profile: Profile }>('/api/auth/register', {
        email,
        password,
        name,
        role,
      });

      const authUser = data.user ?? { id: email, email, name, role };
      const profileData = data.profile ?? {
        id: authUser.id,
        email,
        name,
        role,
        locale: 'vi',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile;

      persistSession(data.token ?? '', authUser, profileData);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Registration failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiPost<{ token: string; user: AuthUser; profile: Profile }>('/api/auth/login', {
        email,
        password,
      });

      const authUser = data.user ?? { id: email, email, name: email, role: 'STUDENT' };
      const profileData = data.profile ?? {
        id: authUser.id,
        email,
        name: authUser.name ?? email,
        role: authUser.role ?? 'STUDENT',
        locale: 'vi',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile;

      persistSession(data.token ?? '', authUser, profileData);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Login failed') };
    }
  };

  const signInWithGoogle = async () => {
    return { error: null };
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      window.localStorage.removeItem('cacao-auth-user');
      window.localStorage.removeItem('cacao-auth-profile');
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signInWithGoogle, signOut }}>
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
