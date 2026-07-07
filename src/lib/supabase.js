import { createClient } from '@supabase/supabase-js';

// Default Supabase config (fallback to empty or environment variables)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('sajja_supabase_url') || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('sajja_supabase_key') || '';

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('https://'));
};

export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Helper to save Supabase config manually in runtime settings modal
export const saveSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem('sajja_supabase_url', url.trim());
    localStorage.setItem('sajja_supabase_key', key.trim());
    window.location.reload();
  }
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('sajja_supabase_url');
  localStorage.removeItem('sajja_supabase_key');
  window.location.reload();
};
