import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const signInWithEmail = async (email, password) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'กรุณาเชื่อมต่อ Supabase ก่อนลงชื่อเข้าใช้งาน' } };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signUpWithEmail = async (email, password, displayName) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'กรุณาเชื่อมต่อ Supabase ก่อนลงชื่อเข้าใช้งาน' } };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName }
      }
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      alert('กรุณาตั้งค่า Supabase API Key ในเมนูการตั้งค่าเพื่อเปิดใช้ Google Login');
      return;
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isDemoMode,
      isSupabaseConfigured: isSupabaseConfigured(),
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
