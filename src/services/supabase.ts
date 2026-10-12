import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_CONFIG = 'zenith_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getStoredSupabaseConfig = (): SupabaseConfig | null => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && !envUrl.includes('placeholder')) {
    return { url: envUrl, anonKey: envKey };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored Supabase configuration', e);
  }

  return null;
};

export const saveSupabaseConfig = (config: SupabaseConfig): void => {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  // Reset client instance
  supabaseInstance = null;
};

export const clearSupabaseConfig = (): void => {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
  supabaseInstance = null;
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const config = getStoredSupabaseConfig();
  if (!config) return null;

  try {
    supabaseInstance = createClient(config.url, config.anonKey);
    return supabaseInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const isSupabaseConnected = (): boolean => {
  return getStoredSupabaseConfig() !== null;
};
